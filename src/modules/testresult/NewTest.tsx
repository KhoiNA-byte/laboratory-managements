// src/modules/testorder/NewTest.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

type CbcParam = {
  id: string;
  name?: string;
  abbreviation?: string;
  value_low_female?: number;
  value_high_female?: number;
  value_low_male?: number;
  value_high_male?: number;
  unit?: string;
};

type TestOrder = {
  id: string | number;
  patient_id?: string | number;
  patientName?: string;
  priority?: string;
  testType?: string; // new field
  supportedTest?: string | string[];
  testResultId?: string | number | null;
  run_id?: string | null;
};

type Instrument = {
  id: string | number;
  name?: string;
  status?: string;
  supportedTest?: string[] | string;
  supportedReagents?: (string | number)[];
};

type Reagent = {
  id: string | number;
  name?: string;
  typeCbcs?: (string | number)[]; // parameter ids
};

type TestResultRowCreate = {
  run_id?: string;
  test_result_id?: string | number;
  parameter_id: string | number;
  result_value: number;
  flag: string;
  evaluate: string;
  deviation: string;
};

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateRunId() {
  try {
    // use crypto.randomUUID if available
    // @ts-ignore
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      // @ts-ignore
      return String(crypto.randomUUID());
    }
  } catch {}
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** evaluate a numeric value against parameter ranges and return flag/evaluate/deviation */
function evaluateParameter(
  value: number,
  param: CbcParam,
  sex: "Male" | "Female"
): { flag: string; evaluate: string; deviation: string } {
  let low: number | null = null;
  let high: number | null = null;

  if (sex === "Female") {
    low =
      typeof param.value_low_female === "number"
        ? param.value_low_female
        : param.value_low_male ?? null;
    high =
      typeof param.value_high_female === "number"
        ? param.value_high_female
        : param.value_high_male ?? null;
  } else {
    low =
      typeof param.value_low_male === "number"
        ? param.value_low_male
        : param.value_low_female ?? null;
    high =
      typeof param.value_high_male === "number"
        ? param.value_high_male
        : param.value_high_female ?? null;
  }

  if (low == null || high == null || low === 0) {
    return { flag: "Normal", evaluate: "Normal", deviation: "0%" };
  }

  if (value < low) {
    const dev = ((low - value) / low) * 100;
    const deviation = `${dev.toFixed(0)}%`;
    const severity = dev >= 50 ? "Low-v3" : dev >= 20 ? "Low-v2" : "Low-v1";
    return { flag: "Low", evaluate: severity, deviation };
  }

  if (value > high) {
    const dev = ((value - high) / high) * 100;
    const deviation = `${dev.toFixed(0)}%`;
    const severity = dev >= 50 ? "High-v3" : dev >= 20 ? "High-v2" : "High-v1";
    return { flag: "High", evaluate: severity, deviation };
  }

  return { flag: "Normal", evaluate: "Normal", deviation: "0%" };
}

export default function NewTest({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (runIdOrResultId: string | number) => void;
}) {
  const [availableOrders, setAvailableOrders] = useState<TestOrder[]>([]);
  const [paramsAll, setParamsAll] = useState<CbcParam[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | number>("");
  const [sex, setSex] = useState<"Male" | "Female">("Male");
  const [loading, setLoading] = useState(false);

  // instrument selection
  const [suggestedInstruments, setSuggestedInstruments] = useState<Instrument[]>([]);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | number | "">("");

  // reagent list resolved
  const [resolvedReagents, setResolvedReagents] = useState<Reagent[]>([]);

  // created rows preview
  const [createdRows, setCreatedRows] = useState<TestResultRowCreate[] | null>(null);
  const [createdResultId, setCreatedResultId] = useState<string | number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    (async () => {
      try {
        // fetch orders and params
        const [ordersRes, paramsRes] = await Promise.all([
          axios.get(`${API_BASE}/test_order`),
          axios.get(`${API_BASE}/cbc_parameters`),
        ]);
        const orders: TestOrder[] = (ordersRes.data || []).filter((o: any) => {
          return o.run_id === undefined || o.run_id === null || String(o.run_id).trim() === "";
        });
        setAvailableOrders(orders);
        setParamsAll(paramsRes.data || []);
        if (orders.length > 0) setSelectedOrderId(orders[0].id);
      } catch (err) {
        console.error("NewTest initial fetch failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  // when selectedOrder changes -> suggest instruments that support its testType
  useEffect(() => {
    if (!selectedOrderId) {
      setSuggestedInstruments([]);
      setSelectedInstrumentId("");
      setResolvedReagents([]);
      return;
    }
    (async () => {
      try {
        const orderRes = await axios.get(`${API_BASE}/test_order/${String(selectedOrderId)}`);
        const order: TestOrder = orderRes.data;
        const testType = order?.testType ?? order?.supportedTest  ?? "";
        // normalize to array of lower-case tokens
        const wanted = Array.isArray(testType)
          ? testType.map((s: any) => String(s).toLowerCase())
          : String(testType).split?.(/[,;|]/).map((s: any) => String(s).trim().toLowerCase());

        const instRes = await axios.get(`${API_BASE}/instruments`);
        const instruments: Instrument[] = instRes.data || [];

        const matched = instruments.filter((it) => {
          if (it.status && String(it.status).toLowerCase() !== "active") return false;
          const sup = it.supportedTest ??  [];
          const supArr = Array.isArray(sup) ? sup.map((t) => String(t).toLowerCase()) : String(sup).split?.(/[,;|]/).map((s: any)=>String(s).trim().toLowerCase()) ?? [];
          // if order has empty testType => show all active
          if (!wanted || wanted.length === 0 || (wanted.length === 1 && wanted[0] === "")) return true;
          return wanted.some((wt: string) => supArr.includes(wt));
        });

        setSuggestedInstruments(matched);
        if (matched.length === 1) setSelectedInstrumentId(String(matched[0].id));
        else setSelectedInstrumentId(matched.length ? String(matched[0].id) : "");
      } catch (err) {
        console.error("suggest instruments failed", err);
        setSuggestedInstruments([]);
        setSelectedInstrumentId("");
        setResolvedReagents([]);
      }
    })();
  }, [selectedOrderId]);

  // when instrument selected -> resolve reagents list for UI and for test
  useEffect(() => {
    if (!selectedInstrumentId) {
      setResolvedReagents([]);
      return;
    }
    (async () => {
      try {
        const instRes = await axios.get(`${API_BASE}/instruments/${String(selectedInstrumentId)}`);
        const inst: Instrument = instRes.data;
        const reagentIds = inst?.supportedReagents ?? [];
        // reagentIds could be names or ids - try fetch each by id first, otherwise query all reagents and match by name
        const reagentsResolved: Reagent[] = [];
        for (const rid of reagentIds) {
          try {
            const r = await axios.get(`${API_BASE}/reagents/${String(rid)}`);
            reagentsResolved.push(r.data);
          } catch {
            // fallback: search reagents by name
            try {
              const allRRes = await axios.get(`${API_BASE}/reagents`);
              const allR: Reagent[] = allRRes.data || [];
              const found = allR.find((rr) => String(rr.id) === String(rid) || String(rr.name).toLowerCase() === String(rid).toLowerCase());
              if (found) reagentsResolved.push(found);
            } catch {}
          }
        }
        setResolvedReagents(reagentsResolved);
      } catch (err) {
        console.error("resolve reagents failed", err);
        setResolvedReagents([]);
      }
    })();
  }, [selectedInstrumentId]);

  // param lookup map
  const paramMap = useMemo(() => {
    const m: Record<string, CbcParam> = {};
    paramsAll.forEach((p) => {
      m[String(p.id)] = p;
      if (p.abbreviation) m[String(p.abbreviation)] = p;
      if (p.name) m[String(p.name)] = p;
    });
    return m;
  }, [paramsAll]);

  const handleCreateTest = async () => {
    if (!selectedOrderId) return alert("Chọn test order trước");
    if (!selectedInstrumentId) return alert("Chọn instrument để chạy test");
    setLoading(true);
    setCreatedRows(null);
    setCreatedResultId(null);

    try {
      // fetch order detail
      const orderRes = await axios.get(`${API_BASE}/test_order/${String(selectedOrderId)}`);
      const order = orderRes.data;

      // build list of parameter ids from reagents' typeCbcs
      const paramIdsSet = new Set<string>();
      for (const r of resolvedReagents) {
        const typeCbcs = r.typeCbcs ?? [];
        for (const tid of typeCbcs) paramIdsSet.add(String(tid));
      }
      // if no resolved reagent produced typeCbcs -> fallback to DEFAULT subset of all params
      const paramIds = Array.from(paramIdsSet).length > 0 ? Array.from(paramIdsSet) : paramsAll.slice(0, 8).map((p) => String(p.id));

      // create run_id and create test_result (without test_order_id and without test_result_rows_id)
      const runId = generateRunId();
      const minimalResultPayload: any = {
        // DO NOT include test_result_rows_id
        // DO NOT include test_order_id per your request
        run_id: runId,
        instrument_id: String(selectedInstrumentId),
        performed_by: order?.patient_id ?? null,
        performed_at: new Date().toISOString(),
        status: "Completed", // per request: mark completed if no error
        raw_hl7: "",
        parsed_obx: {},
        reviewed_by: null,
        reviewed_at: null,
        notes: `Auto-generated test result (mock) for order ${String(selectedOrderId)} via ${String(selectedInstrumentId)}`,
      };

      const trRes = await axios.post(`${API_BASE}/test_results`, minimalResultPayload);
      let testResultId: string | number | null = trRes?.data?.id ?? null;

      // fallback: if API didn't return id directly, try to query by run_id
      if (!testResultId) {
        try {
          const find = await axios.get(`${API_BASE}/test_results?run_id=${encodeURIComponent(runId)}`);
          const arr = find?.data || [];
          if (arr.length > 0) testResultId = arr[0].id ?? null;
        } catch {}
      }

      if (!testResultId) {
        throw new Error("Không lấy được id test_result từ API");
      }
      setCreatedResultId(testResultId);

      // create rows: for each parameter id -> post to /test_result_rows with run_id & test_result_id
      const createdRowsLocal: TestResultRowCreate[] = [];
      const createdRowIds: string[] = [];
      for (const pid of paramIds) {
        // find param details
        const param = paramMap[pid] ?? null;
        const v =
          param != null
            ? (() => {
                const low = sex === "Female" ? param.value_low_female ?? param.value_low_male ?? null : param.value_low_male ?? param.value_low_female ?? null;
                const high = sex === "Female" ? param.value_high_female ?? param.value_high_male ?? null : param.value_high_male ?? param.value_high_female ?? null;
                if (low == null || high == null) return Math.round(randBetween(1, 100) * 10) / 10;
                const min = Math.max(0.01, (low as number) * 0.8);
                const max = (high as number) * 1.2;
                return Math.round(randBetween(min, max) * 10) / 10;
              })()
            : Math.round(randBetween(1, 100) * 10) / 10;

        const ev = evaluateParameter(v, (param as CbcParam) ?? { id: pid }, sex);

        const rowPayload: any = {
          run_id: runId,
          test_result_id: testResultId,
          parameter_id: pid,
          result_value: v,
          flag: ev.flag,
          evaluate: ev.evaluate,
          deviation: ev.deviation,
        };

        try {
          const rr = await axios.post(`${API_BASE}/test_result_rows`, rowPayload);
          const rid = rr?.data?.id ?? null;
          if (rid) createdRowIds.push(String(rid));
          createdRowsLocal.push({
            run_id: runId,
            test_result_id: testResultId,
            parameter_id: pid,
            result_value: v,
            flag: ev.flag,
            evaluate: ev.evaluate,
            deviation: ev.deviation,
          });
        } catch (err) {
          console.error("Create row failed for param", pid, err);
        }
      }

      // PATCH test_order: set run_id and (optionally) testResultId for convenience
      try {
        await axios.patch(`${API_BASE}/test_order/${String(selectedOrderId)}`, { run_id: runId, testResultId: testResultId });
      } catch (err) {
        console.warn("Patch test_order failed, trying PUT fallback", err);
        try {
          // try PUT with existing order object + run_id to maximize chance of persistence
          await axios.put(`${API_BASE}/test_order/${String(selectedOrderId)}`, { ...(order ?? {}), run_id: runId, testResultId: testResultId });
        } catch (err2) {
          console.warn("PUT test_order fallback also failed", err2);
        }
      }

      // optional: PATCH test_result to ensure status/completed updated (we already created with Completed but try to ensure)
      try {
        await axios.patch(`${API_BASE}/test_results/${String(testResultId)}`, { status: "Completed", run_id: runId });
      } catch (err) {
        console.warn("Patch test_result after creating rows failed", err);
      }

      // try fetch created rows by run_id to show to user
      try {
        const rowsRes = await axios.get(`${API_BASE}/test_result_rows?run_id=${encodeURIComponent(runId)}`);
        const created = (rowsRes.data || []).map((r: any) => ({
          run_id: r.run_id,
          test_result_id: r.test_result_id,
          parameter_id: r.parameter_id,
          result_value: r.result_value,
          flag: r.flag,
          evaluate: r.evaluate,
          deviation: r.deviation,
        }));
        setCreatedRows(created);
      } catch (err) {
        console.warn("Fetch created rows by run_id failed", err);
        // fallback show local createdRowsLocal
        setCreatedRows(createdRowsLocal);
      }

      // callback: pass runId so caller can open detail by run_id
      if (onCreated) onCreated(runId);
      alert(`Tạo xong test (result ${String(testResultId)}, run ${runId}) with ${createdRowsLocal.length} rows.`);
    } catch (err) {
      console.error("Failed to create new test", err);
      alert("Create new test failed — check console");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Create New Test (mock)</h2>
            <p className="text-sm text-gray-600">Auto-generate results from reagents & instrument</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm">Sex</label>
            <select value={sex} onChange={(e) => setSex(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button onClick={() => { setCreatedRows(null); setCreatedResultId(null); onClose(); }} className="px-3 py-1 text-sm border rounded">Close</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Select Test Order (no run_id yet)</label>
            {loading ? <div className="text-sm text-gray-500">Loading...</div> :
              availableOrders.length === 0 ? <div className="text-sm text-gray-500">No test orders available (all have run_id/results).</div> :
              <select value={String(selectedOrderId)} onChange={(e) => setSelectedOrderId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                {availableOrders.map((o) => <option key={String(o.id)} value={String(o.id)}>{o.id} {o.patientName ? `– ${o.patientName}` : ""} {o.testType ? `(${o.testType})` : ""}</option>)}
              </select>
            }
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Choose Instrument (supports this order's testType)</label>
            {suggestedInstruments.length === 0 ? <div className="text-sm text-gray-500">No instrument matched — cannot create test</div> :
              <div>
                <select value={String(selectedInstrumentId)} onChange={(e) => setSelectedInstrumentId(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                  {suggestedInstruments.map((it) => <option key={String(it.id)} value={String(it.id)}>{it.name ?? String(it.id)}</option>)}
                </select>
                <div className="text-xs text-gray-500 mt-2">Using reagents: {resolvedReagents.length ? resolvedReagents.map(r => r.name ?? r.id).join(", ") : "—"}</div>
              </div>
            }
          </div>

          <div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setCreatedRows(null); setCreatedResultId(null); onClose(); }} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleCreateTest} disabled={loading || !selectedOrderId || !selectedInstrumentId} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Creating..." : "Create Test"}</button>
            </div>
          </div>

          {createdResultId && createdRows && (
            <div className="mt-4">
              <h4 className="font-semibold">Created Test Result (preview): {String(createdResultId)}</h4>
              <div className="overflow-auto max-h-[30vh] mt-2">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-gray-500">
                    <tr><th className="pb-2">Param</th><th className="pb-2">Value</th><th className="pb-2">Flag</th><th className="pb-2">Evaluate</th><th className="pb-2">Deviation</th></tr>
                  </thead>
                  <tbody>
                    {createdRows.map((r, idx) => {
                      const paramLabel = paramsAll.find(pp => String(pp.id) === String(r.parameter_id))?.name ?? r.parameter_id;
                      return <tr key={idx} className="border-t"><td className="py-2">{paramLabel}</td><td className="py-2">{r.result_value}</td><td className="py-2">{r.flag}</td><td className="py-2">{r.evaluate}</td><td className="py-2">{r.deviation}</td></tr>;
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-sm text-gray-500">Rows: <code>/test_result_rows?run_id=...</code>. Result: <code>/test_results</code> (status = Completed). Test order updated (run_id).</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
