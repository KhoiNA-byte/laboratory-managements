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

/** Comment type (same as slice) */

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";
const sid = (v: any) => (v === null || v === undefined ? "" : String(v));

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateRunId() {
  try {
    // @ts-ignore
    if (typeof crypto !== "Unknown" && "randomUUID" in crypto) {
      // @ts-ignore
      return String(crypto.randomUUID());
    }
  } catch {}
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** helper to build HL7 text from result payload */
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

/** --------------- fetchListSaga --------------- */
function* fetchListSaga(): Generator<any, void, any> {
  try {
    const ordersRes = yield call(axios.get, `${API_BASE}/test_order`);
    const resultsRes = yield call(axios.get, `${API_BASE}/test_results`);
    const orders: any[] = ordersRes?.data ?? [];
    const results: any[] = resultsRes?.data ?? [];

    const inProcess: ListRow[] = (orders || [])
      .filter(
        (o) =>
          o.run_id === undefined ||
          o.run_id === null ||
          String(o.run_id).trim() === ""
      )
      .map((o) => {
        const dateRaw = o.created_at ?? "";
        const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";
        const row: ListRow = {
          id: String(o.id),
          patientName: o.patientName ?? "Unknown",
          date,
          tester: "Admin",
          status: "In Progress",
          source: "order",
          runId: "",
        };
        return row;
      });

    const completedResults = (results || []).filter(
      (r) => String(r.status).toLowerCase() === "completed"
    );
    const completed: ListRow[] = completedResults.map((r) => {
      const matchedOrder = (orders || []).find(
        (o) => o.run_id && r.run_id && String(o.run_id) === String(r.run_id)
      );
      const dateRaw =
        r.performed_at ??
        r.created_at ??
        (matchedOrder ? matchedOrder.created_at : "");
      const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";
      const row: ListRow = {
        id: matchedOrder ? String(matchedOrder.id) : "",
        patientName: matchedOrder?.patientName ?? r.patientName ?? "Unknown",
        date,
        tester: "Admin",
        status: "Completed",
        source: "result",
        runId: r.run_id ? String(r.run_id) : "",
      };
      return row;
    });

    const completedIds = new Set(completed.map((c) => c.id));
    const finalRows: ListRow[] = [
      ...inProcess.filter((r) => !completedIds.has(r.id)),
      ...completed,
    ];

    yield put(fetchListSuccess(finalRows));
  } catch (err: any) {
    yield put(fetchListFailure(err?.message ?? "Fetch list failed"));
  }
}

/** --------------- runTestSaga --------------- */
function* runTestSaga(
  action: ReturnType<typeof runTestRequest>
): Generator<any, void, any> {
  const { orderId, instrumentId, sex, usedReagents } = action.payload as {
    orderId: any;
    instrumentId: any;
    sex?: any;
    usedReagents?: { id: string | number; amountUsed: number; unit?: string }[];
  };

  // helper: parse reference range like "4,000–10,000" or "14–18" -> {low, high}
  const parseRange = (s?: string): { low: number; high: number } | null => {
    if (!s || typeof s !== "string") return null;
    const parts = s.split(/–|—|-|to/).map((p) => p.trim());
    if (parts.length < 2) return null;
    const p0 = Number(parts[0].replace(/[, ]+/g, ""));
    const p1 = Number(parts[1].replace(/[, ]+/g, ""));
    if (Number.isFinite(p0) && Number.isFinite(p1)) {
      return { low: Math.min(p0, p1), high: Math.max(p0, p1) };
    }
    return null;
  };

  // helper: random between
  const randBetweenLocal = (a: number, b: number) =>
    a + Math.random() * (b - a);

  // helper: format result for display per parameter key
  const formatResult = (key: string, v: number) => {
    const k = String(key).toLowerCase();
    if (k.includes("wbc") || k.includes("plt")) {
      return Math.round(v).toLocaleString();
    }
    if (k.includes("rbc")) {
      return (Math.round(v * 100) / 100).toFixed(2);
    }
    if (k.includes("hgb")) {
      return (Math.round(v * 10) / 10).toFixed(1);
    }
    if (k.includes("hct")) {
      return Math.round(v).toString();
    }
    if (k.includes("mcv") || k.includes("mch") || k.includes("mchc")) {
      return Math.round(v).toString();
    }
    return String(v);
  };

  try {
    // 1) fetch order
    const orderRes = yield call(
      axios.get,
      `${API_BASE}/test_order/${sid(orderId)}`
    );
    const order = orderRes?.data ?? {};
    if (order && order.run_id && String(order.run_id).trim() !== "") {
      throw new Error("This test order already has run_id");
    }

    // 2) fetch instrument (for metadata only)
    const instRes = yield call(
      axios.get,
      `${API_BASE}/instruments/${sid(instrumentId)}`
    );
    const inst = instRes?.data ?? {};

    // 3) build rows ALWAYS using fixed template
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

    // generate rows
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

    // 4) create runId and test_result payload including hl7_raw
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
      patientName: order?.patientName ?? order?.patient_name ?? "Unknown",
      sex: sex ?? order?.sex ?? "Unknown",
      collected: performedAt,
      criticalCount: rowsForResult.filter(
        (r) => r.flag === "High" || r.flag === "Low" || r.flag === "Critical"
      ).length,
      rows: rowsForResult,
      comments: [], // keep test_results.comments empty (we use separate /comments)
      notes: `Auto-generated (mock) for order ${sid(orderId)}`,
      hl7_raw: hl7Raw,
    };

    // 5) POST test_result
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
    if (!testResultId) {
      testResultId = `local-${Date.now()}`;
    }

    // 6) create minimal test_result_rows for compatibility (best-effort)
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

    // 7) patch test_orders.run_id
    try {
      yield call(axios.patch, `${API_BASE}/test_order/${sid(orderId)}`, {
        run_id: runId,
      });
    } catch {
      try {
        yield call(axios.put, `${API_BASE}/test_order/${sid(orderId)}`, {
          ...(order ?? {}),
          run_id: runId,
        });
      } catch {}
    }

    // 8) patch reagents quantities (best-effort)
    try {
      const reagentRefs: any[] = inst?.supportedReagents ?? [];
      for (const rid of reagentRefs) {
        try {
          const rcur = yield call(
            axios.get,
            `${API_BASE}/reagents/${sid(rid)}`
          );
          const cur = rcur?.data ?? null;
          if (!cur) continue;
          let amountToUse = 0;
          if (Array.isArray(usedReagents) && usedReagents.length > 0) {
            const u = usedReagents.find(
              (x) =>
                String(x.id) === String(cur.id) ||
                String(x.id) === String(cur.name)
            );
            if (u) amountToUse = Number(u.amountUsed || 0);
          }
          if (!amountToUse) amountToUse = Number(cur.usage_per_run ?? 0);
          const newQty = Math.max(0, Number(cur.quantity ?? 0) - amountToUse);
          yield call(axios.patch, `${API_BASE}/reagents/${sid(cur.id)}`, {
            quantity: newQty,
          });
        } catch {
          // ignore single reagent failure
        }
      }
    } catch {
      // ignore
    }

    // 8.5) Best-effort: create an initial comments thread in /comments (so Comments modal can find it)
    try {
      const commentsPayload = {
        run_id: runId,
        comments: [],
        createdAt: new Date().toISOString(),
        createdBy: "system:auto",
      };
      yield call(axios.post, `${API_BASE}/comments`, commentsPayload);
    } catch {
      // ignore errors from comments creation
    }

    // 9) success -> put into redux
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

/** --------------- updateCommentsSaga --------------- */
/**
 * Payload: { runId, comments[] }
 * - Upsert into /comments by run_id (GET ?run_id=..., PATCH if found, POST if not)
 */
function* updateCommentsSaga(
  action: ReturnType<typeof updateCommentsRequest>
): Generator<any, void, any> {
  const { runId, comments } = action.payload as {
    runId: string;
    comments: CommentItem[];
  };

  try {
    // try find thread by run_id
    let threadId: string | number | null = null;
    try {
      const found = yield call(
        axios.get,
        `${API_BASE}/comments?run_id=${encodeURIComponent(runId)}`
      );
      const arr = found?.data ?? [];
      if (arr.length > 0) threadId = arr[0].id ?? null;
    } catch {
      // ignore lookup errors for now
    }

    if (threadId) {
      // try patch
      try {
        yield call(axios.patch, `${API_BASE}/comments/${sid(threadId)}`, {
          comments,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        // fallback to PUT
        try {
          const existing =
            (yield call(axios.get, `${API_BASE}/comments/${sid(threadId)}`))
              ?.data ?? {};
          yield call(axios.put, `${API_BASE}/comments/${sid(threadId)}`, {
            ...existing,
            comments,
            updatedAt: new Date().toISOString(),
          });
        } catch (err2) {
          throw new Error("Failed to persist comments to comments table");
        }
      }
    } else {
      // create new thread
      try {
        yield call(axios.post, `${API_BASE}/comments`, {
          run_id: runId,
          comments,
          createdAt: new Date().toISOString(),
          createdBy:
            (comments?.length > 0 && comments[comments.length - 1]?.author) ??
            "unknown",
        });
      } catch (err) {
        throw new Error("Failed to create comments thread");
      }
    }

    yield put(updateCommentsSuccess({ runId, comments }));
    // refresh detail so UI consistent
    yield put({ type: fetchDetailRequest.type, payload: runId });
  } catch (err: any) {
    yield put(updateCommentsFailure(err?.message ?? "Update comments failed"));
  }
}

/** --------------- delete/fetchDetail sagas --------------- */
function* deleteResultSaga(
  action: ReturnType<typeof deleteResultRequest>
): Generator<any, void, any> {
  const id = action.payload;
  try {
    try {
      yield call(axios.delete, `${API_BASE}/test_results/${sid(id)}`);
    } catch {
      try {
        const rr = yield call(
          axios.get,
          `${API_BASE}/test_results?run_id=${encodeURIComponent(sid(id))}`
        );
        const arr = rr?.data ?? [];
        for (const it of arr) {
          try {
            yield call(axios.delete, `${API_BASE}/test_results/${sid(it.id)}`);
          } catch {}
        }
      } catch {}
    }

    try {
      const byRun = yield call(
        axios.get,
        `${API_BASE}/test_result_rows?run_id=${encodeURIComponent(sid(id))}`
      );
      const list = byRun?.data ?? [];
      for (const r of list) {
        try {
          yield call(axios.delete, `${API_BASE}/test_result_rows/${sid(r.id)}`);
        } catch {}
      }
    } catch {}

    // also delete comments thread if exists (best-effort)
    try {
      const cfound = yield call(
        axios.get,
        `${API_BASE}/comments?run_id=${encodeURIComponent(sid(id))}`
      );
      const carr = cfound?.data ?? [];
      for (const t of carr) {
        try {
          yield call(axios.delete, `${API_BASE}/comments/${sid(t.id)}`);
        } catch {}
      }
    } catch {}

    yield put(deleteResultSuccess());
    yield put({ type: fetchListRequest.type });
  } catch (err: any) {
    yield put(deleteResultFailure(err?.message ?? "Delete failed"));
  }
}

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

    let order: any = null;
    if (!testResult) {
      try {
        const oRes = yield call(
          axios.get,
          `${API_BASE}/test_order/${encodeURIComponent(orderNumber)}`
        );
        order = oRes?.data ?? null;
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

    // prefer rows stored inside test_result (else query rows table)
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

    // try to read external comments thread (preferred)
    let externalComments: any[] = [];
    try {
      const cc = yield call(
        axios.get,
        `${API_BASE}/comments?run_id=${encodeURIComponent(String(runId))}`
      );
      const carr = cc?.data ?? [];
      if (carr.length > 0) {
        externalComments = carr[0].comments ?? [];
      }
    } catch {
      // ignore
    }

    const detail = {
      patientName:
        testResult.patientName ?? testResult.patient_name ?? "Unknown",
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
      reviewedBy: testResult.reviewedBy ?? testResult.reviewed_by ?? "Unknown",
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

export function* testResultsSaga() {
  yield takeLatest(fetchListRequest.type, fetchListSaga);
  yield takeLatest(runTestRequest.type, runTestSaga);
  yield takeLatest(updateCommentsRequest.type, updateCommentsSaga);
  yield takeLatest(deleteResultRequest.type, deleteResultSaga);
  yield takeLatest(fetchDetailRequest.type, fetchDetailSaga);
}
