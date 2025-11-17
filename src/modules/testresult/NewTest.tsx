// src/modules/testorder/NewTest.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { runTestRequest,UsedReagentLocal } from "../../store/slices/testResultsSlice";
import {
  Instrument,
  TestOrder,
  Reagent,
  CbcParam,
  TestResultRowCreate,
} from "../../store/slices/testResultsSlice";

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";


export default function NewTest({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (runIdOrResultId: string | number) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const runState = useSelector((s: RootState) => s.testResults);
  const running = runState.running;
  const lastRunId = runState.lastRunId;
  const lastResultId = runState.lastResultId;
  const lastRunRows = runState.lastRunRows;

  // local
  const [availableOrders, setAvailableOrders] = useState<TestOrder[]>([]);
  const [paramsAll, setParamsAll] = useState<CbcParam[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | number>("");
  const [sex, setSex] = useState<"Male" | "Female">("Male");
  const [loading, setLoading] = useState(false);

  const [suggestedInstruments, setSuggestedInstruments] = useState<
    Instrument[]
  >([]);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<
    string | number | ""
  >("");

  // store full reagents to resolve by id/name
  const [allReagents, setAllReagents] = useState<Reagent[]>([]);
  // resolved reagents for selected instrument shown to user
  const [resolvedReagents, setResolvedReagents] = useState<UsedReagentLocal[]>(
    []
  );

  const [createdRowsLocal, setCreatedRowsLocal] = useState<
    TestResultRowCreate[] | null
  >(null);
  const [createdResultIdLocal, setCreatedResultIdLocal] = useState<
    string | number | null
  >(null);

  // initial load when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    (async () => {
      try {
        const [ordersRes, paramsRes, instRes, reagentsRes] = await Promise.all([
          axios.get(`${API_BASE}/test_orders`),
          axios.get(`${API_BASE}/cbc_parameters`),
          axios.get(`${API_BASE}/instruments`),
          axios.get(`${API_BASE}/reagents`),
        ]);

        // only orders without run_id
        const orders: TestOrder[] = (ordersRes.data || []).filter((o: any) => {
          return (
            o.run_id === undefined ||
            o.run_id === null ||
            String(o.run_id).trim() === ""
          );
        });

        setAvailableOrders(orders);
        setParamsAll(paramsRes.data || []);
        setAllReagents(reagentsRes.data || []);
        setSuggestedInstruments(instRes.data || []);

        if (orders.length > 0) {
          const defaultOrder = orders[0];
          setSelectedOrderId(defaultOrder.id);

          // find instruments that support that order.testType
          const testType = defaultOrder.testType;
          const filtered = (instRes.data || []).filter((ins: any) =>
            Array.isArray(ins.supportedTest)
              ? ins.supportedTest.includes(testType)
              : ins.supportedTest === testType
          );
          setSuggestedInstruments(filtered);
        }
      } catch (err) {
        // ignore for now
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  // when selectedOrderId changes: update suggested instruments (in case different testType)
  useEffect(() => {
    if (!selectedOrderId) {
      setSuggestedInstruments([]);
      return;
    }
    (async () => {
      try {
        const oRes = await axios.get(
          `${API_BASE}/test_orders/${selectedOrderId}`
        );
        const order: TestOrder = oRes.data;
        const instAll = (await axios.get(`${API_BASE}/instruments`)).data || [];
        const filtered = (instAll || []).filter((ins: any) =>
          Array.isArray(ins.supportedTest)
            ? ins.supportedTest.includes(order.testType)
            : ins.supportedTest === order.testType
        );
        setSuggestedInstruments(filtered);
      } catch {
        setSuggestedInstruments([]);
      }
    })();
  }, [selectedOrderId]);

  // when instrument selected: resolve supportedReagents -> show reagents with usage_per_run and allow edit
  useEffect(() => {
    if (!selectedInstrumentId) {
      setResolvedReagents([]);
      return;
    }
    (async () => {
      try {
        const instRes = await axios.get(
          `${API_BASE}/instruments/${selectedInstrumentId}`
        );
        const inst: Instrument = instRes.data || {};
        const reagentRefs: any[] = inst.supportedReagents ?? [];

        // ensure we have all reagents (from state) else fetch
        let reagentsPool = allReagents;
        if (!reagentsPool || reagentsPool.length === 0) {
          const r = await axios.get(`${API_BASE}/reagents`);
          reagentsPool = r.data || [];
          setAllReagents(reagentsPool);
        }

        const resolved: UsedReagentLocal[] = [];
        for (const rid of reagentRefs) {
          let found = null;
          try {
            const rr = await axios.get(`${API_BASE}/reagents/${rid}`);
            found = rr?.data ?? null;
          } catch {
            found = reagentsPool.find(
              (a) =>
                String(a.id) === String(rid) ||
                String(a.name ?? "").toLowerCase() === String(rid).toLowerCase()
            );
          }
          if (found) {
            resolved.push({
              id: found.id,
              name: found.name,
              unit: found.unit,
              usage_per_run: found.usage_per_run ?? 0,
              amountUsed: Number(found.usage_per_run ?? 0),
            });
          }
        }
        setResolvedReagents(resolved);
      } catch {
        setResolvedReagents([]);
      }
    })();
  }, [selectedInstrumentId, allReagents]);

  const handleChangeReagentAmount = (
    id: string | number,
    newAmount: number
  ) => {
    setResolvedReagents((prev) =>
      prev.map((r) =>
        String(r.id) === String(id) ? { ...r, amountUsed: newAmount } : r
      )
    );
  };

  // dispatch action to create test
  const handleCreateTest = () => {
    if (!selectedOrderId) return alert("Chọn test order trước");
    if (!selectedInstrumentId) return alert("Chọn instrument để chạy test");

    // build usedReagents payload
    const used = resolvedReagents.map((r) => ({
      id: r.id,
      amountUsed: Number(r.amountUsed || 0),
      unit: r.unit,
    }));

    dispatch(
      runTestRequest({
        orderId: selectedOrderId,
        instrumentId: selectedInstrumentId,
        sex,
        usedReagents: used,
      } as any)
    );
  };

  // when saga finishes, populate preview (logic kept but preview UI removed)
  useEffect(() => {
    if (lastRunId && lastResultId) {
      setCreatedResultIdLocal(lastResultId);
      const mapped = (lastRunRows || []).map((r: any) => ({
        run_id: r.run_id,
        test_result_id: r.test_result_id,
        parameter_id: r.parameter_id,
        parameter_name: r.parameter_name,
        result_value: r.result_value,
        flag: r.flag,
        evaluate: r.evaluate,
        deviation: r.deviation,
      }));
      setCreatedRowsLocal(mapped);
      if (onCreated) onCreated(lastRunId as string);
      // keep modal open to show preview (preview UI removed per request)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRunId, lastResultId, lastRunRows]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Create New Test</h2>
            <p className="text-sm text-gray-600">
              Auto-generate results from reagents & instrument
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm">Sex</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as any)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button
              onClick={() => {
                setCreatedRowsLocal(null);
                setCreatedResultIdLocal(null);
                onClose();
              }}
              className="px-3 py-1 text-sm border rounded"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              Select Test Order (no run_id yet)
            </label>
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : availableOrders.length === 0 ? (
              <div className="text-sm text-gray-500">
                No test orders available (all have run_id/results).
              </div>
            ) : (
              <select
                value={String(selectedOrderId)}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {availableOrders.map((o) => (
                  <option key={String(o.id)} value={String(o.id)}>
                    {o.id} {o.patientName ? `– ${o.patientName}` : ""}{" "}
                    {o.testType ? `(${o.testType})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Choose Instrument (supports this order's testType)
            </label>
            {suggestedInstruments.length === 0 ? (
              <div className="text-sm text-gray-500">
                No instrument matched — cannot create test
              </div>
            ) : (
              <div>
                <select
                  value={String(selectedInstrumentId)}
                  onChange={(e) => setSelectedInstrumentId(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">-- Select instrument --</option>
                  {suggestedInstruments.map((it) => (
                    <option key={String(it.id)} value={String(it.id)}>
                      {it.name ?? String(it.id)}
                    </option>
                  ))}
                </select>

                <div className="text-xs text-gray-500 mt-2">
                  Using reagents:{" "}
                  {resolvedReagents.length
                    ? resolvedReagents.map((r) => r.name ?? r.id).join(", ")
                    : "—"}
                </div>
              </div>
            )}
          </div>

          {/* Reagents usage editor */}
          {resolvedReagents.length > 0 && (
            <div>
              <label className="text-sm font-medium block mb-2">
                Reagents & Usage (editable)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resolvedReagents.map((r) => (
                  <div key={String(r.id)} className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{r.name ?? r.id}</div>
                        <div className="text-xs text-gray-500">
                          {r.unit ?? "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Default usage: {r.usage_per_run ?? 0} {r.unit ?? ""}
                        </div>
                      </div>
                      <div className="w-32">
                        <label className="text-xs text-gray-600">
                          Amount to use
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={r.amountUsed as any}
                          onChange={(e) =>
                            handleChangeReagentAmount(
                              r.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setCreatedRowsLocal(null);
                  setCreatedResultIdLocal(null);
                  onClose();
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTest}
                disabled={running || !selectedOrderId || !selectedInstrumentId}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {running ? "Creating..." : "Create Test"}
              </button>
            </div>
          </div>

          {/* Preview removed as requested */}
        </div>
      </div>
    </div>
  );
}
