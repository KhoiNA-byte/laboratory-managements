// src/store/sagas/testResultsSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchListRequest,
  fetchListSuccess,
  fetchListFailure,
  runTestRequest,
  runTestSuccess,
  runTestFailure,
  fetchDetailRequest,
  fetchDetailSuccess,
  fetchDetailFailure,
  updateCommentsRequest,
  updateCommentsSuccess,
  updateCommentsFailure,
  deleteResultRequest,
  deleteResultSuccess,
  deleteResultFailure,
  TestResultRow,
  ListRow,
  CommentItem,
} from "../slices/testResultsSlice";

/**
 * Saga file: supports nested test_orders under user resource:
 * e.g. GET /user/{userId}/test_orders
 *
 * Strategy:
 * - Try direct /test_order (fallback)
 * - Otherwise GET /user and for each user GET /user/{userId}/test_orders and aggregate
 * - When updating/patching an order, prefer /user/{userId}/test_orders/{orderId} if owner userId known.
 */

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";
const sid = (v: any) => (v === null || v === undefined ? "" : String(v));

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateRunId() {
  try {
    // @ts-ignore
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      // @ts-ignore
      return String(crypto.randomUUID());
    }
  } catch {}
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildHL7(
  runId: string,
  order: any,
  instrumentName: string,
  rows: any[],
  patientDob?: string
) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  const patientName = order?.patientName ?? order?.patient_name ?? "Unknown";
  const pidId =
    order?.patient_id ?? order?.id ?? `P${Date.now().toString().slice(-6)}`;
  const nameParts = String(patientName).split(" ");
  const family = nameParts.length > 0 ? nameParts[0] : patientName;
  const given = nameParts.length > 1 ? nameParts.slice(1).join("^") : "";

  const msh = `MSH|^~\\&|LIS|LAB|HIS|HOSPITAL|${ts}||ORU^R01|${runId}|P|2.5`;
  const pid = `PID|1||${pidId}^^^Hospital^MR||${
    given ? `${given}^${family}` : patientName
  }||${patientDob ?? ""}|${order?.sex?.charAt(0) ?? "U"}|||${
    order?.address ?? ""
  }`;
  const obr = `OBR|1|ORD${runId.slice(0, 8)}|RES${runId.slice(
    0,
    8
  )}|CBC^Complete Blood Count^L||${ts}|||||${order?.requester ?? ""}`;

  const obxLines = rows.map((r: any, idx: number) => {
    const seq = idx + 1;
    const code = `${r.parameter}^${r.parameter}^L`;
    const val = String(r.result);
    const unit = r.unit ?? "";
    const ref = (r.referenceRange || "").replace(/,/g, "");
    const flagMap: any = { High: "H", Low: "L", Normal: "N", Critical: "C" };
    const singleFlag = flagMap[r.flag] ?? (r.flag ? r.flag.charAt(0) : "");
    const deviation = r.deviation ?? "";
    const applied = r.appliedEvaluate ?? "";
    return `OBX|${seq}|NM|${code}||${val}|${unit}|${ref}|${singleFlag}|${deviation}|F||${applied}`;
  });

  const nte = `NTE|1||Some parameters flagged high/low — please review applied rules.`;

  const parts = [msh, pid, obr, ...obxLines, nte];
  return parts.join("\n");
}
async function resolveUserNameAsync(
  uidRaw: any,
  userMap: Record<string, string>,
  usersArray: any[] | null = null
): Promise<string | null> {
  if (uidRaw === null || uidRaw === undefined) return null;
  const uid = String(uidRaw);
  if (!uid) return null;

  if (userMap[uid]) return userMap[uid];

  if (Array.isArray(usersArray) && usersArray.length > 0) {
    const found = usersArray.find(
      (u) => String(u.userId) === uid || String(u.id) === uid
    );
    if (found && found.name) {
      userMap[uid] = found.name;
      return found.name;
    }
  }

  try {
    const q = await axios.get(
      `${API_BASE}/user?userId=${encodeURIComponent(uid)}`
    );
    const arr = q?.data ?? [];
    if (Array.isArray(arr) && arr.length > 0 && arr[0].name) {
      userMap[uid] = arr[0].name;
      return arr[0].name;
    }
  } catch {}

  try {
    const byId = await axios.get(`${API_BASE}/user/${encodeURIComponent(uid)}`);
    if (byId?.data && byId.data.name) {
      userMap[uid] = byId.data.name;
      return byId.data.name;
    }
  } catch {}

  try {
    const all = await axios.get(`${API_BASE}/user`);
    const arr = all?.data ?? [];
    if (Array.isArray(arr) && arr.length > 0) {
      const f = arr.find(
        (u) => String(u.userId) === uid || String(u.id) === uid
      );
      if (f && f.name) {
        userMap[uid] = f.name;
        return f.name;
      }
    }
  } catch {}

  return null;
}
function extractUserName(u: any) {
  if (!u) return null;
  return (
    u.name ?? u.fullName ?? u.full_name ?? u.displayName ?? u.display ?? null
  );
}

/**
 * Helper async: fetch list of all test_orders.
 *  - first try GET /test_order (backward compat)
 *  - otherwise fetch /user then for each user call /user/{userId}/test_orders
 */
async function fetchAllOrdersAsync(): Promise<any[]> {
  // try legacy endpoint
  try {
    const res = await axios.get(`${API_BASE}/test_orders`);
    if (Array.isArray(res?.data)) return res.data;
  } catch {
    // ignore - fallback to nested per-user
  }

  // nested per-user
  try {
    const ures = await axios.get(`${API_BASE}/user`);
    const users: any[] = ures?.data ?? [];
    const allOrders: any[] = [];
    for (const u of users) {
      // prefer u.userId (as requested) for nested path
      const uid = u?.userId ?? u?.id;
      if (!uid) continue;
      try {
        const tor = await axios.get(
          `${API_BASE}/user/${encodeURIComponent(uid)}/test_orders`
        );
        if (Array.isArray(tor?.data)) {
          // attach owner for easier patches later
          const withOwner = tor.data.map((o: any) => ({
            ...o,
            ownerUserId: uid,
          }));
          allOrders.push(...withOwner);
        }
      } catch {
        // ignore per-user error
      }
    }
    return allOrders;
  } catch {
    return [];
  }
}

/**
 * Helper async: find order by id (search legacy paths and nested).
 */
async function findOrderByIdAsync(orderId: any): Promise<any | null> {
  if (orderId === null || orderId === undefined) return null;
  const idStr = String(orderId);

  // try direct
  try {
    const r = await axios.get(
      `${API_BASE}/test_orders/${encodeURIComponent(idStr)}`
    );
    if (r?.data) return r.data;
  } catch {}

  // try fallback resource id on /test_order collection (query)
  try {
    const q = await axios.get(
      `${API_BASE}/test_orders?id=${encodeURIComponent(idStr)}`
    );
    const arr = q?.data ?? [];
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  } catch {}

  // try nested per-user
  try {
    const ures = await axios.get(`${API_BASE}/user`);
    const users: any[] = ures?.data ?? [];
    for (const u of users) {
      const uid = u?.userId ?? u?.id;
      if (!uid) continue;
      // try direct item path first
      try {
        const direct = await axios.get(
          `${API_BASE}/user/${encodeURIComponent(
            uid
          )}/test_orders/${encodeURIComponent(idStr)}`
        );
        if (direct?.data) {
          // attach ownerUserId flag
          return { ...direct.data, ownerUserId: uid };
        }
      } catch {
        // try list and search
        try {
          const list = await axios.get(
            `${API_BASE}/user/${encodeURIComponent(uid)}/test_orders`
          );
          const arr = list?.data ?? [];
          const found = (arr || []).find((x: any) => String(x.id) === idStr);
          if (found) return { ...found, ownerUserId: uid };
        } catch {
          // ignore per-user
        }
      }
    }
  } catch {
    // ignore
  }

  // try global test_orders (plural) if exists
  try {
    const t = await axios.get(`${API_BASE}/test_orders`);
    const arr = t?.data ?? [];
    const f = (arr || []).find((x: any) => String(x.id) === idStr);
    if (f) return f;
  } catch {}

  return null;
}

/** small parsing helpers used in runTestSaga */
function parseRange(s?: string): { low: number; high: number } | null {
  if (!s || typeof s !== "string") return null;
  const parts = s.split(/–|—|-|to/).map((p) => p.trim());
  if (parts.length < 2) return null;
  const p0 = Number(parts[0].replace(/[, ]+/g, ""));
  const p1 = Number(parts[1].replace(/[, ]+/g, ""));
  if (Number.isFinite(p0) && Number.isFinite(p1)) {
    return { low: Math.min(p0, p1), high: Math.max(p0, p1) };
  }
  return null;
}

function randBetweenLocal(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function formatResult(key: string, v: number) {
  const k = String(key).toLowerCase();
  if (k.includes("wbc") || k.includes("plt"))
    return Math.round(v).toLocaleString();
  if (k.includes("rbc")) return (Math.round(v * 100) / 100).toFixed(2);
  if (k.includes("hgb")) return (Math.round(v * 10) / 10).toFixed(1);
  if (k.includes("hct")) return Math.round(v).toString();
  if (k.includes("mcv") || k.includes("mch") || k.includes("mchc"))
    return Math.round(v).toString();
  return String(v);
}

/** ------------------ fetchListSaga ------------------ */
function* fetchListSaga(): Generator<any, void, any> {
  try {
    // fetch results (unchanged)
    const resultsRes = yield call(axios.get, `${API_BASE}/test_results`);
    const results: any[] = resultsRes?.data ?? [];

    // fetch users once (best-effort)
    let users: any[] = [];
    try {
      const usersRes = yield call(axios.get, `${API_BASE}/user`);
      users = usersRes?.data ?? [];
    } catch {
      users = [];
    }

    // fetch orders via helper that supports nested per-user
    let orders: any[] = [];
    try {
      orders = yield call(fetchAllOrdersAsync);
    } catch {
      orders = [];
    }

    // build cache map by userId (string)
    const userMap: Record<string, string> = {};
    for (const u of users) {
      const uid = u?.userId ?? u?.id ?? null;
      const name =
        u && typeof u.name === "string" && u.name.trim()
          ? u.name
          : extractUserName(u) ?? "";
      if (uid != null) userMap[String(uid)] = name;
    }

    // build in-process rows using for..of so we can yield to resolve user names if needed
    const inProcessRows: ListRow[] = [];
    for (const o of orders || []) {
      const hasNoRun =
        o.run_id === undefined ||
        o.run_id === null ||
        String(o.run_id).trim() === "";
      if (!hasNoRun) continue;
      const dateRaw = o.created_at ?? o.createdAt ?? "";
      const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";

      // patientName priority: explicit -> lookup by order.userId (this is numeric string) -> Unknown
      let patientName =
        o.patientName ??
        o.patient_name ??
        (o.userId ? userMap[String(o.userId)] : undefined) ??
        "Unknown";

      if (
        (patientName === "Unknown" || !patientName) &&
        (o.userId || o.user_id)
      ) {
        try {
          const nameResolved: string | null = yield call(
            resolveUserNameAsync,
            o.userId ?? o.user_id,
            userMap,
            users
          );
          if (nameResolved) patientName = nameResolved;
        } catch {}
      }

      let tester =
        (o.userId ? userMap[String(o.userId)] : undefined) ??
        o.requester ??
        o.runByUserId ??
        "Admin";

      if (
        (tester === "Admin" || !tester) &&
        (o.runByUserId || o.createdBy || o.created_by)
      ) {
        try {
          const maybe = o.runByUserId ?? o.createdBy ?? o.created_by;
          const tname: string | null = yield call(
            resolveUserNameAsync,
            maybe,
            userMap,
            users
          );
          if (tname) tester = tname;
        } catch {}
      }

      inProcessRows.push({
        id: String(o.id),
        patientName,
        date,
        tester,
        status: "In Progress",
        source: "order",
        runId: "",
      });
    }

    // build completed rows from results (same as before)
    const completedRows: ListRow[] = [];
    const completedResults = (results || []).filter(
      (r) => String(r.status).toLowerCase() === "completed"
    );
    for (const r of completedResults) {
      const matchedOrder = (orders || []).find(
        (o) => o.run_id && r.run_id && String(o.run_id) === String(r.run_id)
      );
      const dateRaw =
        r.performed_at ??
        r.created_at ??
        r.createdAt ??
        (matchedOrder ? matchedOrder.created_at ?? matchedOrder.createdAt : "");
      const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";

      let patientName =
        matchedOrder?.patientName ??
        matchedOrder?.patient_name ??
        r.patientName ??
        r.patient_name ??
        (matchedOrder && matchedOrder.userId
          ? userMap[String(matchedOrder.userId)]
          : undefined) ??
        (r.userId ? userMap[String(r.userId)] : undefined) ??
        "Unknown";

      if (
        (patientName === "Unknown" || !patientName) &&
        matchedOrder &&
        (matchedOrder.userId || matchedOrder.user_id)
      ) {
        try {
          const nameResolved: string | null = yield call(
            resolveUserNameAsync,
            matchedOrder.userId ?? matchedOrder.user_id,
            userMap,
            users
          );
          if (nameResolved) patientName = nameResolved;
        } catch {}
      }

      if (
        (patientName === "Unknown" || !patientName) &&
        (r.userId || r.user_id)
      ) {
        try {
          const nameResolved2: string | null = yield call(
            resolveUserNameAsync,
            r.userId ?? r.user_id,
            userMap,
            users
          );
          if (nameResolved2) patientName = nameResolved2;
        } catch {}
      }

      let tester =
        (r.userId ? userMap[String(r.userId)] : undefined) ??
        r.requester ??
        r.tester ??
        "Admin";

      if (
        (tester === "Admin" || !tester) &&
        (r.runByUserId || r.createdBy || r.created_by)
      ) {
        try {
          const maybe = r.runByUserId ?? r.createdBy ?? r.created_by;
          const tname: string | null = yield call(
            resolveUserNameAsync,
            maybe,
            userMap,
            users
          );
          if (tname) tester = tname;
        } catch {}
      }

      completedRows.push({
        id: matchedOrder ? String(matchedOrder.id) : String(r.id ?? ""),
        patientName,
        date,
        tester,
        status: "Completed",
        source: "result",
        runId: r.run_id ? String(r.run_id) : "",
      });
    }

    const completedIds = new Set(completedRows.map((c) => c.id));
    const finalRows: ListRow[] = [
      ...inProcessRows.filter((r) => !completedIds.has(r.id)),
      ...completedRows,
    ];

    yield put(fetchListSuccess(finalRows));
  } catch (err: any) {
    yield put(fetchListFailure(err?.message ?? "Fetch list failed"));
  }
}

/** ------------------ runTestSaga ------------------ */
function* runTestSaga(
  action: ReturnType<typeof runTestRequest>
): Generator<any, void, any> {
  const { orderId, instrumentId, sex, usedReagents } = action.payload as {
    orderId: any;
    instrumentId: any;
    sex?: any;
    usedReagents?: { id: string | number; amountUsed: number; unit?: string }[];
  };

  try {
    // fetch order via robust finder (handles nested paths)
    const order: any = yield call(findOrderByIdAsync, orderId) || {};

    if (order && order.run_id && String(order.run_id).trim() !== "") {
      throw new Error("This test order already has run_id");
    }

    const instRes = yield call(
      axios.get,
      `${API_BASE}/instruments/${sid(instrumentId)}`
    );
    const inst = instRes?.data ?? {};

    // try resolve patient name by order.userId (userId domain)
    let resolvedPatientName: string | null = null;
    if (order && (order.userId || order.user_id)) {
      try {
        resolvedPatientName = yield call(
          resolveUserNameAsync,
          order.userId ?? order.user_id,
          {},
          null
        );
      } catch {
        resolvedPatientName = null;
      }
    }

    // resolve current user from localStorage and fetch their name
    let currentUserId: string | null = null;
    let currentUserName: string | null = null;
    try {
      if (typeof localStorage !== "undefined") {
        // <-- keep reading 'userId' (the id field in localStorage) as requested
        currentUserId =
          localStorage.getItem("userId") ||
          localStorage.getItem("user_id") ||
          localStorage.getItem("id") ||
          null;
        if (!currentUserId) {
          const maybeUser =
            localStorage.getItem("user") ||
            localStorage.getItem("auth") ||
            null;
          if (maybeUser) {
            try {
              const parsed = JSON.parse(maybeUser);
              currentUserId = String(
                parsed?.userId ?? parsed?.id ?? parsed?.user_id ?? currentUserId
              );
            } catch {}
          }
        }
        if (currentUserId) {
          try {
            currentUserName = yield call(
              resolveUserNameAsync,
              currentUserId,
              {},
              null
            );
          } catch {}
        }
      }
    } catch {
      currentUserId = currentUserId ?? null;
      currentUserName = null;
    }

    // build result rows (CBC)
    const PARAM_TEMPLATE: {
      key: string;
      parameter: string;
      unit: string;
      referenceRange: string;
    }[] = [
      {
        key: "WBC",
        parameter: "WBC",
        unit: "cells/µL",
        referenceRange: "4,000–10,000",
      },
      { key: "HGB", parameter: "HGB", unit: "g/dL", referenceRange: "14–18" },
      { key: "HCT", parameter: "HCT", unit: "%", referenceRange: "42–52" },
      {
        key: "PLT",
        parameter: "PLT",
        unit: "cells/µL",
        referenceRange: "150,000–350,000",
      },
      { key: "MCV", parameter: "MCV", unit: "fL", referenceRange: "80–100" },
      {
        key: "RBC",
        parameter: "RBC",
        unit: "million/µL",
        referenceRange: "4.2–5.4",
      },
      { key: "MCH", parameter: "MCH", unit: "pg", referenceRange: "27–33" },
      { key: "MCHC", parameter: "MCHC", unit: "g/dL", referenceRange: "32–36" },
    ];

    const rowsForResult: any[] = [];
    for (const tpl of PARAM_TEMPLATE) {
      const rng = parseRange(tpl.referenceRange);
      let value: number;
      if (rng) {
        const low = rng.low;
        const high = rng.high;
        const p = Math.random();
        if (p < 0.75) {
          value = randBetweenLocal(low, high);
        } else if (p < 0.875) {
          value = randBetweenLocal(
            Math.max(0, low * 0.5),
            Math.max(0, low - (high - low) * 0.05)
          );
        } else {
          value = randBetweenLocal(
            high + Math.max(1, (high - low) * 0.01),
            high * 1.5
          );
        }
      } else {
        value = Math.round(randBetweenLocal(1, 100) * 10) / 10;
      }

      let flag = "Normal";
      let deviation = "0%";
      if (rng) {
        const low = rng.low;
        const high = rng.high;
        if (value < low) {
          flag = "Low";
          const pct = Math.round(((low - value) / (low || 1)) * 100);
          deviation = `-${pct}%`;
        } else if (value > high) {
          flag = "High";
          const pct = Math.round(((value - high) / (high || 1)) * 100);
          deviation = `+${pct}%`;
        } else {
          flag = "Normal";
          deviation = "0%";
        }
      }

      let appliedEvaluate = "-";
      if (flag === "High")
        appliedEvaluate = Math.random() < 0.5 ? "High-v1" : "High-v2";
      if (flag === "Low") appliedEvaluate = "Low-v1";

      const formatted = formatResult(tpl.key, value);

      rowsForResult.push({
        parameter: tpl.parameter,
        result: formatted,
        unit: tpl.unit,
        referenceRange: tpl.referenceRange,
        deviation,
        flag,
        appliedEvaluate,
      });
    }

    const runId = generateRunId();
    const performedAt = new Date().toISOString();
    const hl7Raw = buildHL7(
      runId,
      order,
      inst?.name ?? sid(instrumentId),
      rowsForResult,
      order?.dob
    );

    const testResultPayload: any = {
      run_id: runId,
      instrument: inst?.name ?? sid(instrumentId),
      performed_at: performedAt,
      status: "Completed",
      patientName:
        order?.patientName ??
        order?.patient_name ??
        resolvedPatientName ??
        "Unknown",
      sex: sex ?? order?.sex ?? "Unknown",
      collected: performedAt,
      criticalCount: rowsForResult.filter(
        (r) => r.flag === "High" || r.flag === "Low" || r.flag === "Critical"
      ).length,
      rows: rowsForResult,
      comments: [],
      notes: `Auto-generated (mock) for order ${sid(orderId)}`,
      hl7_raw: hl7Raw,
      // <-- set runByUserId/runByName: prefer localStorage values, default to "unknown"
      runByUserId: currentUserId ?? "unknown",
      runByName: currentUserName ?? "unknown",
    };

    let trResData: any = null;
    try {
      const trRes = yield call(
        axios.post,
        `${API_BASE}/test_results`,
        testResultPayload
      );
      trResData = trRes?.data ?? null;
    } catch {
      trResData = null;
    }

    let testResultId = trResData?.id ?? null;
    if (!testResultId) {
      try {
        const find = yield call(
          axios.get,
          `${API_BASE}/test_results?run_id=${encodeURIComponent(runId)}`
        );
        const arr = find?.data ?? [];
        if (arr.length > 0) testResultId = arr[0].id ?? null;
      } catch {}
    }
    if (!testResultId) testResultId = `local-${Date.now()}`;

    for (const r of rowsForResult) {
      const rowPayload: any = {
        run_id: runId,
        test_result_id: testResultId,
        parameter_name: r.parameter,
        result_value: r.result,
        flag: r.flag,
        evaluate: r.appliedEvaluate,
        deviation: r.deviation,
        unit: r.unit,
      };
      try {
        yield call(axios.post, `${API_BASE}/test_result_rows`, rowPayload);
      } catch {}
    }

    // patch test order: prefer nested path /user/{userId}/test_orders/{orderId} when we know ownerUserId
    const ownerUserId =
      order?.ownerUserId ?? order?.userId ?? order?.user_id ?? null;
    let patched = false;
    if (ownerUserId) {
      try {
        yield call(
          axios.patch,
          `${API_BASE}/user/${encodeURIComponent(
            ownerUserId
          )}/test_orders/${sid(orderId)}`,
          {
            run_id: runId,
            // <-- use currentUserId or "unknown"
            runByUserId: currentUserId ?? "unknown",
            tester: currentUserName ?? order?.tester ?? order?.requester,
          }
        );
        patched = true;
      } catch {
        // ignore, fallback below
      }
    }

    if (!patched) {
      try {
        // try legacy singular collection
        yield call(axios.patch, `${API_BASE}/test_order/${sid(orderId)}`, {
          run_id: runId,
          runByUserId: currentUserId ?? "unknown",
          tester: currentUserName ?? order?.tester ?? order?.requester,
        });
        patched = true;
      } catch {
        // fallback to put
        try {
          // attempt nested put if ownerUserId known
          if (ownerUserId) {
            yield call(
              axios.put,
              `${API_BASE}/user/${encodeURIComponent(
                ownerUserId
              )}/test_orders/${sid(orderId)}`,
              {
                ...(order ?? {}),
                run_id: runId,
                runByUserId: currentUserId ?? "unknown",
                tester: currentUserName ?? order?.tester ?? order?.requester,
              }
            );
            patched = true;
          } else {
            yield call(axios.put, `${API_BASE}/test_orders/${sid(orderId)}`, {
              ...(order ?? {}),
              run_id: runId,
              runByUserId: currentUserId ?? "unknown",
              tester: currentUserName ?? order?.tester ?? order?.requester,
            });
            patched = true;
          }
        } catch {
          // ignore
        }
      }
    }

    // update reagents (best-effort)
    try {
      const instFull = inst; // already fetched
      const reagentRefs: any[] = instFull?.supportedReagents ?? [];

      for (const rid of reagentRefs) {
        try {
          // 1) Try resolve reagent by id first, else try search-by-name
          let cur: any = null;
          if (rid !== null && rid !== undefined && String(rid).trim() !== "") {
            // try GET by id
            try {
              const rcur = yield call(
                axios.get,
                `${API_BASE}/reagents/${encodeURIComponent(sid(rid))}`
              );
              cur = rcur?.data ?? null;
            } catch (err) {
              // not found by id — we'll try search by name below
              cur = null;
            }

            if (!cur) {
              // try search endpoint by name / partial match
              try {
                const searchRes = yield call(
                  axios.get,
                  `${API_BASE}/reagents?search=${encodeURIComponent(
                    String(rid)
                  )}`
                );
                const arr = searchRes?.data ?? [];
                // pick exact name match or first match
                cur =
                  arr.find(
                    (a: any) =>
                      String(a.id) === String(rid) ||
                      String(a.name ?? "").toLowerCase() ===
                        String(rid).toLowerCase()
                  ) ??
                  arr[0] ??
                  null;
              } catch (err) {
                cur = null;
              }
            }
          }

          if (!cur) {
            console.warn("[runTestSaga] reagent not found for ref:", rid);
            continue;
          }

          // 2) determine amountToUse
          let amountToUse = 0;
          if (Array.isArray(usedReagents) && usedReagents.length > 0) {
            const u = usedReagents.find(
              (x: any) =>
                String(x.id) === String(cur.id) ||
                String(x.id) === String(cur.name)
            );
            if (u) amountToUse = Number(u.amountUsed || 0);
          }
          if (!amountToUse) amountToUse = Number(cur.usage_per_run ?? 0);

          // 3) compute new quantity
          const currentQty = Number(cur.quantity ?? 0);
          const newQty = Math.max(0, currentQty - amountToUse);

          // quick no-op check
          if (newQty === currentQty) {
            // nothing to change, skip update (but still log)
            console.info(
              `[runTestSaga] reagent ${sid(
                cur.id
              )} no change in quantity (${currentQty})`
            );
            continue;
          }

          // 4) attempt PATCH, fallback to PUT if PATCH fails (404/405)
          try {
            const patchRes = yield call(
              axios.patch,
              `${API_BASE}/reagents/${encodeURIComponent(sid(cur.id))}`,
              { quantity: newQty }
            );
            console.info(
              `[runTestSaga] PATCH reagent ${sid(cur.id)} success`,
              patchRes?.data ?? null
            );
          } catch (errPatch: any) {
            console.warn(
              `[runTestSaga] PATCH failed for reagent ${sid(
                cur.id
              )} — trying PUT`,
              errPatch?.message ?? errPatch
            );
            try {
              // fetch existing full object then PUT updated object (safer fallback)
              const existingRes = yield call(
                axios.get,
                `${API_BASE}/reagents/${encodeURIComponent(sid(cur.id))}`
              );
              const existing = existingRes?.data ?? {};
              const putPayload = { ...existing, quantity: newQty };
              const putRes = yield call(
                axios.put,
                `${API_BASE}/reagents/${encodeURIComponent(sid(cur.id))}`,
                putPayload
              );
              console.info(
                `[runTestSaga] PUT reagent ${sid(cur.id)} success`,
                putRes?.data ?? null
              );
            } catch (errPut: any) {
              console.error(
                `[runTestSaga] PUT fallback failed for reagent ${sid(cur.id)}`,
                errPut?.message ?? errPut
              );
              // don't throw to block other reagents — just continue
            }
          }
        } catch (singleErr) {
          console.warn(
            "[runTestSaga] single reagent update error for ref:",
            rid,
            singleErr
          );
          // continue to next reagent
        }
      }
    } catch (outerErr) {
      // overall reagent update process failure — log but don't fail whole saga
      console.error("[runTestSaga] reagent update outer error:", outerErr);
    }

    // create comments thread (best-effort)
    try {
      const commentsPayload = {
        run_id: runId,
        comments: [],
        createdAt: new Date().toISOString(),
        // <-- use "unknown" default here as requested
        runByUserId: currentUserId ?? "unknown",
        createdByName: currentUserName ?? "unknown",
      };
      yield call(axios.post, `${API_BASE}/comments`, commentsPayload);
    } catch {}

    const rowsToReturn: TestResultRow[] = rowsForResult.map((r: any) => ({
      run_id: runId,
      test_result_id: testResultId,
      parameter_name: r.parameter,
      result_value: r.result,
      flag: r.flag,
      evaluate: r.appliedEvaluate,
      deviation: r.deviation,
      unit: r.unit,
    }));

    yield put(runTestSuccess({ runId, testResultId, rows: rowsToReturn }));
    yield put({ type: fetchListRequest.type });
  } catch (err: any) {
    yield put(runTestFailure(err?.message ?? "Run test failed"));
  }
}

/** ------------------ updateCommentsSaga ------------------ */
function* updateCommentsSaga(
  action: ReturnType<typeof updateCommentsRequest>
): Generator<any, void, any> {
  const { runId, comments } = action.payload as {
    runId: string;
    comments: CommentItem[];
  };
  try {
    let threadId: string | number | null = null;
    try {
      const found = yield call(
        axios.get,
        `${API_BASE}/comments?run_id=${encodeURIComponent(runId)}`
      );
      const arr = found?.data ?? [];
      if (arr.length > 0) threadId = arr[0].id ?? null;
    } catch {}

    if (threadId) {
      try {
        yield call(axios.patch, `${API_BASE}/comments/${sid(threadId)}`, {
          comments,
          updatedAt: new Date().toISOString(),
        });
      } catch {
        try {
          const existing =
            (yield call(axios.get, `${API_BASE}/comments/${sid(threadId)}`))
              ?.data ?? {};
          yield call(axios.put, `${API_BASE}/comments/${sid(threadId)}`, {
            ...existing,
            comments,
            updatedAt: new Date().toISOString(),
          });
        } catch {
          throw new Error("Failed to persist comments to comments table");
        }
      }
    } else {
      try {
        yield call(axios.post, `${API_BASE}/comments`, {
          run_id: runId,
          comments,
          createdAt: new Date().toISOString(),
          createdBy:
            (comments?.length > 0 && comments[comments.length - 1]?.author) ??
            "unknown",
        });
      } catch {
        throw new Error("Failed to create comments thread");
      }
    }

    yield put(updateCommentsSuccess({ runId, comments }));
  } catch (err: any) {
    yield put(updateCommentsFailure(err?.message ?? "Update comments failed"));
  }
}

/** ------------------ deleteResultSaga ------------------ */
function* deleteResultSaga(
  action: ReturnType<typeof deleteResultRequest>
): Generator<any, void, any> {
  const id = action.payload;
  const enc = (v: any) => encodeURIComponent(sid(v));
  try {
    // 1) Try treat id as a resource id on /test_results
    try {
      yield call(axios.delete, `${API_BASE}/test_results/${sid(id)}`);
    } catch {
      // ignore
    }

    // 2) Delete test_results records where run_id = id
    try {
      const rr = yield call(
        axios.get,
        `${API_BASE}/test_results?run_id=${enc(id)}`
      );
      const arr = rr?.data ?? [];
      for (const it of arr) {
        try {
          yield call(axios.delete, `${API_BASE}/test_results/${sid(it.resultId)}`);
        } catch {}
      }
    } catch {}

    // 3) Delete test_result_rows by run_id
    try {
      const byRun = yield call(
        axios.get,
        `${API_BASE}/test_result_rows?run_id=${enc(id)}`
      );
      const list = byRun?.data ?? [];
      for (const r of list) {
        try {
          yield call(axios.delete, `${API_BASE}/test_result_rows/${sid(r.id)}`);
        } catch {}
      }
    } catch {}

    // 4) Delete comments / test_result_comment threads by run_id (try multiple possible endpoints)
    const commentEndpoints = [
      `comments`,
      `test_result_comment`,
      `test_result_comments`,
    ];
    for (const ep of commentEndpoints) {
      try {
        const found = yield call(
          axios.get,
          `${API_BASE}/${ep}?run_id=${enc(id)}`
        );
        const carr = found?.data ?? [];
        for (const t of carr) {
          try {
            yield call(axios.delete, `${API_BASE}/${ep}/${sid(t.id)}`);
          } catch {}
        }
      } catch {
        // endpoint may not exist — ignore
      }
    }

    // 5) Delete test_orders by run_id — try plural /test_orders, singular /test_order/:id and nested /user/{userId}/test_orders
    // 5a. Try global collection /test_orders?run_id=...
    try {
      const toRes = yield call(
        axios.get,
        `${API_BASE}/test_orders?run_id=${enc(id)}`
      );
      const ords = toRes?.data ?? [];
      for (const o of ords) {
        try {
          // prefer deleting by resource id if available
          if (o && o.id) {
            try {
              yield call(axios.delete, `${API_BASE}/test_orders/${sid(o.id)}`);
            } catch {
              // some APIs may use /test_order singular for delete
              try {
                yield call(axios.delete, `${API_BASE}/test_order/${sid(o.id)}`);
              } catch {}
            }
          }
        } catch {}
      }
    } catch {}

    // 5b. Try singular path /test_order?run_id=...
    try {
      const toRes2 = yield call(
        axios.get,
        `${API_BASE}/test_order?run_id=${enc(id)}`
      );
      const ords2 = toRes2?.data ?? [];
      for (const o of ords2) {
        try {
          if (o && o.id) {
            try {
              yield call(axios.delete, `${API_BASE}/test_order/${sid(o.id)}`);
            } catch {
              // ignore
            }
          }
        } catch {}
      }
    } catch {}

    // 5c. Try nested user path: GET /user then for each user GET /user/{userId}/test_orders?run_id=...
    try {
      const ures = yield call(axios.get, `${API_BASE}/user`);
      const users = ures?.data ?? [];
      for (const u of users) {
        const uid = u?.userId ?? u?.id;
        if (!uid) continue;
        try {
          const nested = yield call(
            axios.get,
            `${API_BASE}/user/${encodeURIComponent(
              uid
            )}/test_orders?run_id=${enc(id)}`
          );
          const nestedArr = nested?.data ?? [];
          for (const no of nestedArr) {
            try {
              // delete nested resource
              yield call(
                axios.delete,
                `${API_BASE}/user/${encodeURIComponent(uid)}/test_orders/${sid(
                  no.id
                )}`
              );
            } catch {
              try {
                // fallback: attempt deleting via top-level collection if available
                if (no && no.id) {
                  yield call(
                    axios.delete,
                    `${API_BASE}/test_orders/${sid(no.id)}`
                  );
                }
              } catch {}
            }
          }
        } catch {
          // per-user nested endpoint may not exist — ignore
        }
      }
    } catch {}

    // 6) Best-effort: also try delete test_orders by searching id as resource id
    try {
      // try singular resource delete
      yield call(axios.delete, `${API_BASE}/test_orders/${sid(id)}`);
    } catch {
      try {
        yield call(axios.delete, `${API_BASE}/test_order/${sid(id)}`);
      } catch {}
    }

    yield put(deleteResultSuccess());
    yield put({ type: fetchListRequest.type });
  } catch (err: any) {
    yield put(deleteResultFailure(err?.message ?? "Delete failed"));
  }
}

/** ------------------ fetchDetailSaga ------------------ */
function* fetchDetailSaga(
  action: ReturnType<typeof fetchDetailRequest>
): Generator<any, void, any> {
  const orderNumber = action.payload;
  try {
    let testResult: any = null;

    try {
      const byId = yield call(
        axios.get,
        `${API_BASE}/test_results/${encodeURIComponent(orderNumber)}`
      );
      if (byId?.data) testResult = byId.data;
    } catch {}

    if (!testResult) {
      try {
        const byRun = yield call(
          axios.get,
          `${API_BASE}/test_results?run_id=${encodeURIComponent(orderNumber)}`
        );
        const arr = byRun?.data ?? [];
        if (arr.length > 0) testResult = arr[0];
      } catch {}
    }

    // if still not found, try treat orderNumber as test_order id and find linked result
    let order: any = null;
    if (!testResult) {
      try {
        // robust find for order (supports nested /user/{userId}/test_orders and /test_order)
        order = yield call(findOrderByIdAsync, orderNumber);
        if (order && order.run_id) {
          const tr = yield call(
            axios.get,
            `${API_BASE}/test_results?run_id=${encodeURIComponent(
              order.run_id
            )}`
          );
          const arr = tr?.data ?? [];
          if (arr.length > 0) testResult = arr[0];
        }
      } catch {}
    }

    if (!testResult) throw new Error("Result not found");

    const runId = testResult.run_id ?? testResult.id;

    let rows: any[] = [];
    if (Array.isArray(testResult.rows) && testResult.rows.length > 0) {
      rows = testResult.rows;
    } else {
      try {
        const rr = yield call(
          axios.get,
          `${API_BASE}/test_result_rows?run_id=${encodeURIComponent(
            String(runId)
          )}`
        );
        rows = rr?.data ?? [];
      } catch {}
    }

    const mapped = (rows || []).map((r: any) => ({
      parameter: r.parameter_name ?? r.parameter ?? r.parameter_id ?? "",
      result: String(r.result_value ?? r.result ?? r.value ?? ""),
      unit: r.unit ?? r.uom ?? "",
      referenceRange: r.referenceRange ?? r.reference_range ?? "",
      deviation: r.deviation ?? "",
      flag: r.flag ?? (r.deviation && r.deviation !== "0%" ? "High" : "Normal"),
      appliedEvaluate: r.appliedEvaluate ?? r.evaluate ?? "",
    }));

    let externalComments: any[] = [];
    try {
      const cc = yield call(
        axios.get,
        `${API_BASE}/comments?run_id=${encodeURIComponent(String(runId))}`
      );
      const carr = cc?.data ?? [];
      if (carr.length > 0) externalComments = carr[0].comments ?? [];
    } catch {}

    // Resolve patientName from order/testResult/user table (best-effort)
    let patientNameResolved =
      testResult.patientName ?? testResult.patient_name ?? "Unknown";
    try {
      if (
        (patientNameResolved === "Unknown" || !patientNameResolved) &&
        order &&
        (order.userId || order.user_id || order.ownerUserId)
      ) {
        const uid = order.userId ?? order.user_id ?? order.ownerUserId;
        const uName: string | null = yield call(
          resolveUserNameAsync,
          uid,
          {},
          null
        );
        if (uName) patientNameResolved = uName;
      }

      if (
        (patientNameResolved === "Unknown" || !patientNameResolved) &&
        (testResult.userId ||
          testResult.user_id ||
          testResult.runByUserId ||
          testResult.createdBy ||
          testResult.created_by)
      ) {
        const uid =
          testResult.userId ??
          testResult.user_id ??
          testResult.runByUserId ??
          testResult.createdBy ??
          testResult.created_by;
        const uName2: string | null = yield call(
          resolveUserNameAsync,
          uid,
          {},
          null
        );
        if (uName2) patientNameResolved = uName2;
      }
    } catch {}

    let reviewedByResolved =
      testResult.reviewedBy ?? testResult.reviewed_by ?? "Unknown";
    try {
      const rbId =
        testResult.reviewedBy ??
        testResult.reviewed_by ??
        testResult.reviewedByUserId ??
        null;
      if (rbId) {
        const rbName: string | null = yield call(
          resolveUserNameAsync,
          rbId,
          {},
          null
        );
        if (rbName) reviewedByResolved = rbName;
      }
    } catch {}

    const detail = {
      patientName: patientNameResolved,
      sex: testResult.sex ?? "Unknown",
      collected:
        testResult.collected ??
        testResult.performed_at ??
        testResult.created_at ??
        "Unknown",
      instrument: testResult.instrument ?? "Unknown",
      criticalCount:
        testResult.criticalCount ??
        mapped.filter(
          (m) => m.flag === "High" || m.flag === "Low" || m.flag === "Critical"
        ).length,
      rows: mapped,
      reviewedBy: reviewedByResolved,
      reviewedAt: testResult.reviewedAt ?? testResult.reviewed_at ?? "Unknown",
      comments:
        externalComments.length > 0
          ? externalComments
          : Array.isArray(testResult.comments)
          ? testResult.comments
          : [],
      run_id: String(runId),
      hl7_raw: testResult.hl7_raw ?? testResult.raw_hl7 ?? "",
    };

    yield put(fetchDetailSuccess(detail));
  } catch (err: any) {
    yield put(fetchDetailFailure(err?.message ?? "Fetch detail failed"));
  }
}

/** root saga */
export function* testResultsSaga() {
  yield takeLatest(fetchListRequest.type, fetchListSaga);
  yield takeLatest(runTestRequest.type, runTestSaga);
  yield takeLatest(updateCommentsRequest.type, updateCommentsSaga);
  yield takeLatest(deleteResultRequest.type, deleteResultSaga);
  yield takeLatest(fetchDetailRequest.type, fetchDetailSaga);
}
