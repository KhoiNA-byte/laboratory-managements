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
} from "../slices/testResultsSlice";

/** Comment type (same as slice) */
export type CommentItem = {
  id: string;
  author: string;
  authorInitials?: string;
  role?: string;
  text: string;
  createdAt: string;
};

export type TestOrder = {
  id: string | number;
  patient_id?: string | number;
  patientName?: string;
  priority?: string;
  testType?: string;
  testResultId?: string | number | null;
  run_id?: string | null;
  created_at?: string;
  sex?: string;
  [k: string]: any;
};

export type Instrument = {
  id: string | number;
  name?: string;
  status?: string;
  supportedTest?: string[] | string;
  supportedReagents?: (string | number)[];
  [k: string]: any;
};

export type Reagent = {
  id: string | number;
  name?: string;
  usage_per_run?: number;
  unit?: string;
  quantity?: number;
  typeCbcs?: (string | number)[];
  [k: string]: any;
};

export type CbcParam = {
  id: string | number;
  name?: string;
  abbreviation?: string;
  value_low_female?: number;
  value_high_female?: number;
  value_low_male?: number;
  value_high_male?: number;
  unit?: string;
  [k: string]: any;
};

export type TestResultRowCreate = {
  id?: string | number;
  run_id?: string;
  test_result_id?: string | number;
  parameter_id?: string | number;
  parameter_name?: string;
  result_value?: number | string;
  flag?: string;
  evaluate?: string;
  deviation?: string;
  unit?: string;
};

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

/** simple evaluation (placeholder) */
function evaluateParameterSimple(value: number) {
  if (value > 9000)
    return {
      flag: "High",
      evaluate: "High",
      deviation: `${Math.round(((value - 9000) / 9000) * 100)}%`,
    };
  if (value < 1)
    return {
      flag: "Low",
      evaluate: "Low",
      deviation: `${Math.round(((1 - value) / 1) * 100)}%`,
    };
  return { flag: "Normal", evaluate: "Normal", deviation: "0%" };
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
          runId: undefined,
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
        id: matchedOrder ? String(matchedOrder.id) : `R-${String(r.id)}`,
        patientName: matchedOrder?.patientName ?? r.patientName ?? "Unknown",
        date,
        tester: "Admin",
        status: "Completed",
        source: "result",
        runId: r.run_id ? String(r.run_id) : undefined,
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
/**
 * create test_result (rich object), create rows, patch order.run_id, patch reagents quantities (best-effort)
 */
// --- replace runTestSaga with this implementation ---
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
      // integer with thousand separator
      return Math.round(v).toLocaleString();
    }
    if (k.includes("rbc")) {
      return (Math.round(v * 100) / 100).toFixed(2); // 2 decimals
    }
    if (k.includes("hgb")) {
      return (Math.round(v * 10) / 10).toFixed(1); // 1 decimal
    }
    if (k.includes("hct")) {
      return Math.round(v).toString();
    }
    if (k.includes("mcv") || k.includes("mch") || k.includes("mchc")) {
      return Math.round(v).toString();
    }
    return String(v);
  };

  // helper: compute deviation percent relative to nearest bound (high for above, low for below)
  const computeDeviation = (value: number, low: number, high: number) => {
    if (value >= low && value <= high) return "0%";
    if (value > high) {
      const pct = Math.round(((value - high) / high) * 100);
      return `${pct >= 0 ? "+" : ""}${pct}%`;
    } else {
      // below
      const pct = Math.round(((value - low) / low) * 100);
      return `${pct <= 0 ? "" : "-"}${Math.abs(pct)}%`;
    }
  };

  // list of parameters we always produce (matching your example)
  const PARAM_TEMPLATE: {
    key: string; // used to decide formatting
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

    // 3) fetch reagents pool (best-effort)
    let allReagents: any[] = [];
    try {
      const a = yield call(axios.get, `${API_BASE}/reagents`);
      allReagents = a?.data ?? [];
    } catch {}

    // 4) build rows ALWAYS using PARAM_TEMPLATE
    const rowsForResult: any[] = [];
    for (const tpl of PARAM_TEMPLATE) {
      const rng = parseRange(tpl.referenceRange);
      let value: number;
      if (rng) {
        const low = rng.low;
        const high = rng.high;
        // with 75% probability pick inside range, else outside (below or above)
        const p = Math.random();
        if (p < 0.75) {
          value = randBetweenLocal(low, high);
        } else if (p < 0.875) {
          // below: pick between low*0.6 and low - small
          const belowMax = Math.max(0, low - (high - low) * 0.05);
          value = randBetweenLocal(
            Math.max(0, low * 0.5),
            Math.max(belowMax, Math.max(0, low - 0.1 * low))
          );
        } else {
          // above: pick between high + small and high*1.5
          value = randBetweenLocal(
            high + Math.max(1, (high - low) * 0.01),
            high * 1.5
          );
        }
      } else {
        // no range -> fallback to small random
        value = Math.round(randBetweenLocal(1, 100) * 10) / 10;
      }

      // rounding/formatting: also convert units where reference contains thousands separators
      // compute flag & deviation
      let flag = "Normal";
      let deviation = "0%";
      if (rng) {
        const low = rng.low;
        const high = rng.high;
        if (value < low) {
          flag = "Low";
          // deviation relative to low
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
      } else {
        flag = "Normal";
        deviation = "0%";
      }

      // applyEvaluate: if abnormal choose variant, else "-"
      let appliedEvaluate = "-";
      if (flag === "High") {
        appliedEvaluate = Math.random() < 0.5 ? "High-v1" : "High-v2";
      } else if (flag === "Low") {
        appliedEvaluate = "Low-v1";
      }

      const formatted = formatResult(tpl.key, value);

      // push final row object (stringified result)
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

    // 5) create runId and test_result object that includes rows array (exact shape you requested)
    const runId = generateRunId();
    const performedAt = new Date().toISOString();
    const testResultPayload: any = {
      run_id: runId,
      instrument: inst?.name ?? sid(instrumentId),
      performed_at: performedAt,
      status: "Completed",
      patientName: order?.patientName ?? order?.patient_name ?? "Unknown",
      sex: sex ?? order?.sex ?? undefined,
      collected: performedAt,
      criticalCount: rowsForResult.filter(
        (r) => r.flag === "High" || r.flag === "Low" || r.flag === "Critical"
      ).length,
      rows: rowsForResult,
      comments: [], // initially empty
      notes: `Auto-generated (mock) for order ${sid(orderId)}`,
    };

    // POST test_result with full object
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
      // try search by run_id
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

    // 6) Optionally create /test_result_rows entries for compatibility (best-effort)
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
      } catch {
        // ignore failure
      }
    }

    // 7) patch test_order.run_id
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

    // 8) patch reagents quantities based on usedReagents or instrument default (best-effort)
    // resolve instrument.supportedReagents -> reduce reagent.quantity by amountUsed if provided or usage_per_run
    try {
      const instFull = inst; // already fetched
      const reagentRefs: any[] = instFull?.supportedReagents ?? [];
      for (const rid of reagentRefs) {
        // find reagent entry
        try {
          const rcur = yield call(
            axios.get,
            `${API_BASE}/reagents/${sid(rid)}`
          );
          const cur = rcur?.data ?? null;
          if (!cur) continue;
          // find user provided amount if any
          let amountToUse = 0;
          if (Array.isArray(usedReagents) && usedReagents.length > 0) {
            const u = usedReagents.find(
              (x) =>
                String(x.id) === String(cur.id) ||
                String(x.id) === String(cur.name)
            );
            if (u) amountToUse = Number(u.amountUsed || 0);
          }
          // fallback to reagent.usage_per_run
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

    // 9) put result into redux store (rows converted to TestResultRow shape)
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
 * - Find test_result by run_id, patch comments field (overwrite)
 */
function* updateCommentsSaga(
  action: ReturnType<typeof updateCommentsRequest>
): Generator<any, void, any> {
  const { runId, comments } = action.payload as {
    runId: string;
    comments: CommentItem[];
  };
  try {
    // try find test_result by run_id
    let targetId: string | number | null = null;
    try {
      const found = yield call(
        axios.get,
        `${API_BASE}/test_results?run_id=${encodeURIComponent(runId)}`
      );
      const arr = found?.data ?? [];
      if (arr.length > 0) targetId = arr[0].id ?? null;
    } catch {}

    // if not found by run_id, maybe runId is actual id
    if (!targetId) targetId = runId;

    if (!targetId)
      throw new Error("Cannot determine test_result id to update comments");

    // patch test_result with new comments array (overwrite)
    try {
      yield call(axios.patch, `${API_BASE}/test_results/${sid(targetId)}`, {
        comments,
      });
    } catch {
      // fallback put
      try {
        const existing =
          (yield call(axios.get, `${API_BASE}/test_results/${sid(targetId)}`))
            ?.data ?? {};
        yield call(axios.put, `${API_BASE}/test_results/${sid(targetId)}`, {
          ...(existing ?? {}),
          comments,
        });
      } catch {
        // if all fails, throw to enter catch below
        throw new Error("Failed to persist comments");
      }
    }

    // success
    yield put(updateCommentsSuccess({ runId, comments }));
    // refresh detail so UI consistent
    yield put({ type: fetchDetailRequest.type, payload: runId } as any);
  } catch (err: any) {
    yield put(updateCommentsFailure(err?.message ?? "Update comments failed"));
  }
}

/** --------------- other sagas (delete/fetchDetail) remain similar to prior implementation --------------- */
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
    // try fetch test_result by id or run_id
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

    // fallback: try treat as test_order id then find its run_id
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

    // if (!testResult) throw new Error("Result not found");

    const runId = testResult.run_id ?? testResult.id;

    // prefer rows stored inside test_result (rows array) else query test_result_rows
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

    // map to UI row format
    const mapped = (rows || []).map((r: any) => ({
      parameter: r.parameter_name ?? r.parameter ?? r.parameter_id ?? "",
      result: String(r.result_value ?? r.result ?? r.value ?? ""),
      unit: r.unit ?? r.uom ?? "",
      referenceRange: r.referenceRange ?? r.reference_range ?? "",
      deviation: r.deviation ?? "",
      flag: r.flag ?? (r.deviation && r.deviation !== "0%" ? "High" : "Normal"),
      appliedEvaluate: r.appliedEvaluate ?? r.evaluate ?? "",
    }));

    const detail = {
      patientName:
        testResult.patientName ?? testResult.patient_name ?? "Unknown",
      sex: testResult.sex ?? undefined,
      collected:
        testResult.collected ??
        testResult.performed_at ??
        testResult.created_at ??
        undefined,
      instrument: testResult.instrument ?? undefined,
      criticalCount:
        testResult.criticalCount ??
        mapped.filter(
          (m) => m.flag === "High" || m.flag === "Low" || m.flag === "Critical"
        ).length,
      rows: mapped,
      reviewedBy: testResult.reviewedBy ?? testResult.reviewed_by ?? undefined,
      reviewedAt: testResult.reviewedAt ?? testResult.reviewed_at ?? undefined,
      comments: Array.isArray(testResult.comments) ? testResult.comments : [],
      run_id: String(runId),
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
