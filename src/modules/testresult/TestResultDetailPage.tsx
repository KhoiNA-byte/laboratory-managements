import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Comments from "./CommentsPage";
import HL7Viewer from "./HL7Viewer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchDetailRequest,
  updateCommentsRequest,
} from "../../store/slices/testResultsSlice";
import {
  CommentItem,
  TestResultDetail,
} from "../../store/slices/testResultsSlice";
import { TestParameter } from "../../types/testResult";

export default function TestResultDetailPage(): JSX.Element {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // Nhận basic info từ MyTestResultsPage (nếu có)
  const stateData = location.state as
    | {
        background?: Location;
        testOrderId: string;
        patient: string;
        date: string;
        tester: string;
        status: string;
        runId: string | number;
      }
    | undefined;

  const detail = useSelector((s: RootState) => s.testResults.detail);
  const loadingDetail = useSelector(
    (s: RootState) => s.testResults.loadingDetail
  );

  const [rowsState, setRowsState] = useState<any[]>([]);
  // other local UI states...
  const [isReviewing, setIsReviewing] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isHL7Open, setIsHL7Open] = useState(false);
  const [reviewedBy, setReviewedBy] = useState<string>("AI Auto Review");
  const [reviewedAt, setReviewedAt] = useState<string | undefined>(undefined);
  const [comments, setComments] = useState<CommentItem[]>([]);

  useEffect(() => {
    if (!orderNumber) {
      navigate(-1);
      return;
    }
    dispatch(fetchDetailRequest(orderNumber));
  }, [orderNumber, dispatch, navigate]);

  // when detail loaded, map to rowsState and meta
  useEffect(() => {
    if (!detail) {
      setRowsState([]);
      return;
    }
    setRowsState(detail.rows.map((r) => ({ ...r })));
    setReviewedBy(detail.reviewedBy ?? "AI Auto Review");
    setReviewedAt(detail.reviewedAt);
    setComments(detail.comments ?? []);
  }, [detail]);

  // handler when CommentsPage changes comments list
  const handleChangeComments = (updatedComments: CommentItem[]) => {
    setComments(updatedComments);
    // persist into backend: use run_id from detail (must exist)
    const runId = detail?.run_id;
    if (!runId) {
      // if no runId, try to use orderNumber as run id
      alert("Cannot persist comments: missing run id");
      return;
    }
    dispatch(updateCommentsRequest({ runId, comments: updatedComments }));
  };

  if (!orderNumber || (!detail && loadingDetail)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Loading...</h3>
        </div>
      </div>
    );
  }

  if (!detail && !loadingDetail) {
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

  // build stats
  const total = rowsState.length;
  const normal = rowsState.filter((r) => !r.flag || r.flag === "Normal").length;
  const high = rowsState.filter((r) => r.flag === "High").length;
  const low = rowsState.filter((r) => r.flag === "Low").length;

  return (
    <div>
      {/* overlay + popup same structure as your original file */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        onClick={() => {
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
                Run: {detail?.run_id} • {detail?.patientName}
                <p className="mx-2 py-1"></p> Sex: {detail?.sex ?? "Unknown"}
              </div>
            </div>
            <div className="block gap-3">
              <div className="text-sm text-gray-500">
                Collected: {detail?.collected}
              </div>
              <div className="text-sm text-gray-500">
                Instrument: {detail?.instrument ?? "-"}
              </div>
              <div className="mt-3 inline-flex items-center gap-2">
                <span className="inline-block bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {detail?.criticalCount ?? 0} Critical Values
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
                          <tr
                            key={idx}
                            className="align-top border-b border-gray-100"
                          >
                            <td className="py-4 pr-6 font-semibold text-gray-700 w-48 truncate">
                              {r.parameter}
                            </td>
                            <td className="py-4 pr-6">
                              <div
                                className={`inline-block px-3 py-1 rounded font-semibold ${
                                  r.flag === "High"
                                    ? "bg-red-50 text-red-700"
                                    : r.flag === "Low"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {r.result}
                              </div>
                            </td>
                            <td className="py-4 pr-6 text-sm text-gray-600">
                              {r.unit ?? "-"}
                            </td>
                            <td className="py-4 pr-6 text-sm text-gray-600">
                              {r.referenceRange ?? "-"}
                            </td>
                            <td className="py-4 pr-6 text-sm text-gray-600">
                              {r.deviation ?? "-"}
                            </td>
                            <td className="py-4 pr-6">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-3 w-3 rounded-full inline-block ${
                                    r.flag === "High"
                                      ? "bg-red-500"
                                      : r.flag === "Low"
                                      ? "bg-amber-500"
                                      : r.flag === "Critical"
                                      ? "bg-red-700"
                                      : "bg-green-500"
                                  }`}
                                />
                                <span className="text-sm text-gray-600">
                                  {r.flag ?? "Normal"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 pr-6 text-sm text-gray-600">
                              {r.appliedEvaluate ?? "-"}
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
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Summary
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex justify-between">
                        <span>Total tests</span>
                        <strong>{total}</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Normal</span>
                        <strong>{normal}</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>High</span>
                        <strong>{high}</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Low</span>
                        <strong>{low}</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 border">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Reviewed
                    </h4>
                    <div className="text-sm text-gray-600">By</div>
                    <div className="mt-3 text-sm font-medium">
                      {reviewedBy}
                      {reviewedAt
                        ? ` • ${new Date(reviewedAt).toLocaleString()}`
                        : ""}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 border">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Actions
                    </h4>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => alert("Downloading PDF (placeholder)")}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:shadow"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" /> Download PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsHL7Open(true)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:shadow"
                      >
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
                {comments.length === 0 ? (
                  <span>Empty</span>
                ) : (
                  <span className="flex-1 truncate whitespace-nowrap overflow-hidden text-ellipsis">{`(${
                    comments[comments.length - 1].author
                  }) ${comments[comments.length - 1].text}`}</span>
                )}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setIsCommentsOpen(true)}
                  className="text-blue-600 underline"
                >
                  More comment
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Review/save (mock)");
                }}
                className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                Review
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            aria-label="Close"
            className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-gray-50"
          >
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {isCommentsOpen && detail?.run_id && (
        <Comments
          orderNumber={String(detail.run_id)}
          initialComments={comments}
          onClose={() => setIsCommentsOpen(false)}
          onChangeComments={(c) => handleChangeComments(c)}
        />
      )}

      {isHL7Open && detail?.hl7_raw !== undefined && (
        <HL7Viewer
          // Basic info - ưu tiên từ stateData, fallback về detail
          testOrderId={
            stateData?.testOrderId ?? String(detail.run_id ?? orderNumber)
          }
          patient={stateData?.patient ?? detail.patientName ?? "Unknown"}
          date={stateData?.date ?? detail.collected ?? ""}
          tester={stateData?.tester ?? "Unknown"}
          status={stateData?.status ?? "Completed"}
          orderNumber={String(detail.run_id ?? orderNumber)}
          sex={detail.sex ?? "Unknown"}
          // Parameters từ rowsState
          parameters={rowsState.map(
            (r): TestParameter => ({
              parameter: r.parameter || "",
              result: r.result || "",
              unit: r.unit || "",
              referenceRange: r.referenceRange || "",
              deviation: r.deviation || "",
              flag: r.flag || "Normal",
              appliedEvaluate: r.appliedEvaluate,
            })
          )}
          // Raw HL7
          rawHL7={detail.hl7_raw ?? ""}
          onClose={() => setIsHL7Open(false)}
        />
      )}
    </div>
  );
}
