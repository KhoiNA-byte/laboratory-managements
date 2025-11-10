// src/modules/testorder/TestResultDetailPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Comments, { CommentItem } from "./CommentsPage";
import HL7Viewer from "./HL7Viewer";
import axios from "axios";

/* ------------- Types ------------- */
type ParamRow = {
  parameter: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  deviation?: string;
  flag?: "High" | "Low" | "Normal" | "Critical";
  appliedEvaluate?: string;
};

type OrderData = {
  patientName: string;
  sex?: string;
  collected?: string;
  instrument?: string;
  criticalCount?: number;
  rows: ParamRow[];
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: CommentItem[];
  run_id?: string;
};

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";

const structuredCloneSafe = <T,>(v: T): T => {
  try {
    return JSON.parse(JSON.stringify(v));
  } catch {
    return v;
  }
};

function getCurrentUserName(): string {
  try {
    const keys = ["currentUser", "user", "authUser", "userInfo", "auth"];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      try {
        const obj = JSON.parse(raw);
        if (!obj) continue;
        if (typeof obj === "string" && obj.trim()) return obj;
        if (obj.name) return obj.name;
        if (obj.fullName) return obj.fullName;
        if (obj.username) return obj.username;
        if (obj.displayName) return obj.displayName;
      } catch {
        if (raw.trim()) return raw;
      }
    }
  } catch {}
  return "Admin User";
}

export default function TestResultDetailPage(): JSX.Element {
  // orderNumber param can be: test_order id OR run_id OR test_result id
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [isHL7Open, setIsHL7Open] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | undefined>(undefined);
  const [rowsState, setRowsState] = useState<ParamRow[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const originalRowsRef = useRef<ParamRow[] | null>(null);

  const [reviewedBy, setReviewedBy] = useState<string>("AI Auto Review");
  const [reviewedAt, setReviewedAt] = useState<string | undefined>(undefined);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!orderNumber) {
        navigate(-1);
        return;
      }
      try {
        // 1) Try fetch /test_results/:orderNumber (maybe they passed test_result id)
        let testResult: any = null;
        try {
          const trRes = await axios.get(`${API_BASE}/test_results/${encodeURIComponent(orderNumber)}`);
          if (trRes?.data) testResult = trRes.data;
        } catch (err) {
          // ignore: not found or API returns non-200
        }

        // 2) If not found, try treat orderNumber as test_order id -> fetch order to obtain run_id
        let order: any = null;
        if (!testResult) {
          try {
            const oRes = await axios.get(`${API_BASE}/test_order/${encodeURIComponent(orderNumber)}`);
            if (oRes?.data) order = oRes.data;
          } catch (err) {
            // not an order id
          }
        } else {
          // if we fetched testResult, try fetch corresponding order to get patientName etc
          try {
            const maybeOrderRes = await axios.get(`${API_BASE}/test_order?run_id=${encodeURIComponent(String(testResult.run_id ?? testResult.id))}`);
            const list = maybeOrderRes?.data || [];
            if (list.length > 0) order = list[0];
          } catch {}
        }

        // 3) If we have order and it contains run_id, and testResult is still null, query test_results by run_id
        if (!testResult && order && (order.run_id || order.test_run_id)) {
          const runId = order.run_id ?? order.test_run_id;
          try {
            const listRes = await axios.get(`${API_BASE}/test_results?run_id=${encodeURIComponent(String(runId))}`);
            const list = listRes?.data || [];
            if (list.length > 0) testResult = list[0];
          } catch {}
        }

        // 4) If still not found, maybe the orderNumber itself is a run_id -> query by run_id
        if (!testResult) {
          try {
            const listRes = await axios.get(`${API_BASE}/test_results?run_id=${encodeURIComponent(orderNumber)}`);
            const list = listRes?.data || [];
            if (list.length > 0) testResult = list[0];
          } catch {}
        }

        // If still no testResult found -> show not found
        if (!testResult) {
          setOrderData(undefined);
          return;
        }

        // Ensure we have order info (patientName, etc.). If not, try fetching by test_order_id inside testResult
        if (!order && testResult?.test_order_id) {
          try {
            const oRes = await axios.get(`${API_BASE}/test_order/${encodeURIComponent(String(testResult.test_order_id))}`);
            if (oRes?.data) order = oRes.data;
          } catch {}
        }

        // fetch rows by run_id (preferred) or by test_result_id fallback
        const runId = testResult.run_id ?? testResult.id;
        let rows: any[] = [];
        try {
          const rr = await axios.get(`${API_BASE}/test_result_rows?run_id=${encodeURIComponent(String(runId))}`);
          rows = rr?.data || [];
        } catch (err) {
          // fallback to query by test_result_id
          try {
            const rr2 = await axios.get(`${API_BASE}/test_result_rows?test_result_id=${encodeURIComponent(String(testResult.id))}`);
            rows = rr2?.data || [];
          } catch {}
        }

        // Map rows -> ParamRow
        const mappedRows: ParamRow[] = (rows || []).map((r: any) => ({
          parameter: r.parameter_name ?? r.parameter_id ?? String(r.id),
          result: String(r.result_value ?? r.value ?? r.result ?? ""),
          unit: r.unit ?? r.uom ?? "",
          referenceRange: r.reference_range ?? "",
          deviation: r.deviation ?? "",
          flag: r.flag ?? (r.deviation && r.deviation !== "0%" ? "High" : "Normal"),
          appliedEvaluate: r.evaluate ?? "",
        }));

        // build OrderData
        const od: OrderData = {
          patientName: order?.patientName ?? testResult?.patientName ?? "Unknown",
          sex: order?.sex ?? testResult?.sex ?? undefined,
          collected: testResult?.performed_at ?? testResult?.created_at ?? order?.created_at ?? undefined,
          instrument: testResult?.instrument_id ?? order?.instrument ?? undefined,
          criticalCount: mappedRows.filter((rr) => rr.flag === "High" || rr.flag === "Low" || rr.flag === "Critical").length,
          rows: mappedRows,
          reviewedBy: testResult?.reviewed_by ?? undefined,
          reviewedAt: testResult?.reviewed_at ?? undefined,
          comments: Array.isArray(testResult?.comments) ? testResult.comments : [],
          run_id: String(runId),
        };

        setOrderData(structuredCloneSafe(od));
        setRowsState(mappedRows);
        setReviewedBy(od.reviewedBy ?? "AI Auto Review");
        setReviewedAt(od.reviewedAt);
        setComments(od.comments ?? []);
      } catch (err) {
        console.error("Failed to load test result detail:", err);
        setOrderData(undefined);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, navigate]);

  const handleStartReview = () => {
    originalRowsRef.current = structuredCloneSafe(rowsState);
    setIsReviewing(true);
  };
  const handleCancelReview = () => {
    if (originalRowsRef.current)
      setRowsState(structuredCloneSafe(originalRowsRef.current));
    originalRowsRef.current = null;
    setIsReviewing(false);
  };
  const handleSaveReview = async () => {
    // This is mock — we only update UI/local state. If you want to persist:
    // find test_result by run_id and PATCH reviewed_by/reviewed_at and maybe update rows.
    if (orderData?.run_id) {
      const currentUser = getCurrentUserName();
      const now = new Date().toISOString();
      setReviewedBy(currentUser);
      setReviewedAt(now);
      setOrderData((d) => (d ? { ...d, reviewedBy: currentUser, reviewedAt: now } : d));
      alert("Saved review changes (mock). To persist to backend, implement PATCH /test_results by run_id.");
    }
    originalRowsRef.current = null;
    setIsReviewing(false);
  };

  const handleFieldChange = (index: number, field: keyof ParamRow, value: string) => {
    setRowsState((prev) => {
      const copy = prev.map((r) => ({ ...r }));
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleReview = () => {
    if (isReviewing) handleSaveReview();
    else handleStartReview();
  };
  const handleDownloadPdf = () => alert("Downloading PDF (placeholder)");
  const handleViewHL7 = () => setIsHL7Open(true);

  // comments
  const openComments = () => setIsCommentsOpen(true);
  const closeComments = () => setIsCommentsOpen(false);
  const onChangeComments = (newComments: CommentItem[]) => {
    setComments(newComments);
    // persist to backend optional: PATCH test_results by run_id
  };

  const latestComment = comments.length === 0 ? null : comments.slice().sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt))[0];

  if (!orderNumber || !orderData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Result not found</h3>
          <p className="text-sm text-gray-600 mb-6">
            Cannot find test result for <strong>{orderNumber}</strong>
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = rowsState.length;
  const normal = rowsState.filter((r) => !r.flag || r.flag === "Normal").length;
  const high = rowsState.filter((r) => r.flag === "High").length;
  const low = rowsState.filter((r) => r.flag === "Low").length;

  return (
    <div>
      {!isCommentsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
            onClick={() => {
              if (isReviewing) {
                handleCancelReview();
                return;
              }
              navigate(-1);
            }}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] mx-auto overflow-hidden flex flex-col h-[calc(100vh-4rem)] md:h-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Complete Blood Count (CBC)
                  </h2>
                  <div className="text-sm text-gray-500 mt-1 py-2">
                    Run: {orderData.run_id} • {orderData.patientName}{" "}
                    <p className="mx-2 py-1"></p> Sex: {orderData.sex ?? "Unknown"}
                  </div>
                </div>
                <div className="block  gap-3">
                  <div className="text-sm text-gray-500">
                    Collected: {orderData.collected}
                  </div>
                  <div className="text-sm text-gray-500">
                    Instrument: {orderData.instrument ?? "-"}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2">
                    <span className="inline-block bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {orderData.criticalCount ?? 0} Critical Values
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="overflow-x-auto">
                      <div className="max-h-[55vh] md:max-h-[60vh] overflow-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-sm text-gray-500 border-b border-gray-100">
                              <th className="py-3 pr-6">Parameter</th>
                              <th className="py-3 pr-6">Result</th>
                              <th className="py-3 pr-6">Unit</th>
                              <th className="py-3 pr-6">Reference range</th>
                              <th className="py-3 pr-6">Deviation</th>
                              <th className="py-3 pr-6">Flag</th>
                              <th className="py-3 pr-6">Applied Evaluate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowsState.map((r, idx) => (
                              <tr key={idx} className="align-top border-b border-gray-100">
                                <td className="py-4 pr-6 font-semibold text-gray-700 w-48 truncate">
                                  {r.parameter}
                                </td>

                                <td className="py-4 pr-6">
                                  {isReviewing ? (
                                    <input
                                      type="text"
                                      value={r.result}
                                      onChange={(e) =>
                                        handleFieldChange(idx, "result", e.target.value)
                                      }
                                      className="w-36 px-2 py-1 border rounded text-sm"
                                    />
                                  ) : (
                                    <div className={`inline-block px-3 py-1 rounded font-semibold ${
                                      r.flag === "High" ? "bg-red-50 text-red-700" :
                                      r.flag === "Low" ? "bg-yellow-50 text-yellow-700" :
                                      "bg-gray-100 text-gray-700"
                                    }`}>
                                      {r.result}
                                    </div>
                                  )}
                                </td>

                                <td className="py-4 pr-6 text-sm text-gray-600">{r.unit ?? "-"}</td>
                                <td className="py-4 pr-6 text-sm text-gray-600">{r.referenceRange ?? "-"}</td>

                                <td className="py-4 pr-6 text-sm text-gray-600">
                                  {isReviewing ? (
                                    <input
                                      type="text"
                                      value={r.deviation ?? ""}
                                      onChange={(e) => handleFieldChange(idx, "deviation", e.target.value)}
                                      className="w-28 px-2 py-1 border rounded text-sm"
                                      placeholder="-"
                                    />
                                  ) : (
                                    r.deviation ?? "-"
                                  )}
                                </td>

                                <td className="py-4 pr-6">
                                  <div className="flex items-center gap-2">
                                    <span className={`h-3 w-3 rounded-full inline-block ${
                                      r.flag === "High" ? "bg-red-500" :
                                      r.flag === "Low" ? "bg-amber-500" :
                                      r.flag === "Critical" ? "bg-red-700" :
                                      "bg-green-500"
                                    }`} />
                                    <span className="text-sm text-gray-600">{r.flag ?? "Normal"}</span>
                                  </div>
                                </td>

                                <td className="py-4 pr-6 text-sm text-gray-600">
                                  {isReviewing ? (
                                    <input
                                      type="text"
                                      value={r.appliedEvaluate ?? ""}
                                      onChange={(e) => handleFieldChange(idx, "appliedEvaluate", e.target.value)}
                                      className="w-40 px-2 py-1 border rounded text-sm"
                                      placeholder="-"
                                    />
                                  ) : (
                                    r.appliedEvaluate ?? "-"
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-[320px] flex-shrink-0">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg shadow-md p-4 border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Summary</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex justify-between"><span>Total tests</span><strong>{total}</strong></li>
                          <li className="flex justify-between"><span>Normal</span><strong>{normal}</strong></li>
                          <li className="flex justify-between"><span>High</span><strong>{high}</strong></li>
                          <li className="flex justify-between"><span>Low</span><strong>{low}</strong></li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-4 border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Reviewed</h4>
                        <div className="text-sm text-gray-600">By</div>
                        <div className="mt-3 text-sm font-medium">
                          {reviewedBy}
                          {reviewedAt ? ` • ${new Date(reviewedAt).toLocaleString()}` : ""}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-4 border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
                        <div className="space-y-3">
                          <button type="button" onClick={handleDownloadPdf} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:shadow">
                            <ArrowDownTrayIcon className="h-4 w-4" /> Download PDF
                          </button>
                          <button type="button" onClick={handleViewHL7} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:shadow">
                            View Raw HL7
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-700 max-w-[60%]">
                  <div className="flex items-center gap-2">
                    <strong>Comment:</strong>
                    {latestComment ? (
                      <span className="flex-1 truncate whitespace-nowrap overflow-hidden text-ellipsis" title={`${latestComment.author}: ${latestComment.text}`}>
                        <span className="font-bold">({latestComment.author})</span> {latestComment.text}
                      </span>
                    ) : <span>Empty</span>}
                  </div>

                  <div className="mt-2">
                    <button onClick={(e)=>{e.preventDefault(); openComments();}} className="text-blue-600 underline">More comment</button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => { if (isReviewing) handleCancelReview(); else navigate(-1); }} className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:shadow">
                    {isReviewing ? "Cancel" : "Cancel"}
                  </button>

                  <button onClick={handleReview} className={`px-4 py-2 rounded-lg text-sm ${isReviewing ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                    {isReviewing ? "Save" : "Review"}
                  </button>
                </div>
              </div>

              <button onClick={() => { if (isReviewing) handleCancelReview(); else navigate(-1); }} aria-label="Close" className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-gray-50">
                <XMarkIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </>
      )}

      {isCommentsOpen && orderNumber && (
        <Comments
          orderNumber={orderNumber}
          initialComments={comments}
          onClose={() => setIsCommentsOpen(false)}
          onChangeComments={(c) => onChangeComments(c)}
        />
      )}

      {isHL7Open && orderNumber && (
        <HL7Viewer orderNumber={orderNumber} rawHL7={""} onClose={() => setIsHL7Open(false)} />
      )}
    </div>
  );
}
