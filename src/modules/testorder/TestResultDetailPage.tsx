// src/modules/testorder/TestResultDetailPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

type ParamRow = {
  parameter: string;
  result: string;
  unit: string;
  referenceRange: string;
  deviation?: string;
  flag?: "High" | "Low" | "Normal" | "Critical";
  appliedEvaluate?: string;
};

type OrderData = {
  patientName: string;
  sex: string;
  collected: string;
  instrument: string;
  criticalCount: number;
  rows: ParamRow[];
};

const MOCK_DATA: Record<string, OrderData> = {
  "TO-2025-005": {
    patientName: "Tran Gia Huy",
    sex: "Female",
    collected: "2025-01-13 08:35",
    instrument: "Cobas c311",
    criticalCount: 2,
    rows: [
      { parameter: "WBC", result: "12,000", unit: "cells/µL", referenceRange: "4,000–10,000", deviation: "+20%", flag: "High", appliedEvaluate: "High-v2" },
      { parameter: "HGB", result: "14.1", unit: "g/dL", referenceRange: "14–18", deviation: "-1%", flag: "Normal", appliedEvaluate: "-" },
      { parameter: "HCT", result: "45", unit: "%", referenceRange: "42–52", flag: "High", appliedEvaluate: "High-v1" },
      { parameter: "PLT", result: "100,000", unit: "cells/µL", referenceRange: "150,000–350,000", flag: "Low", appliedEvaluate: "Low-v1" },
      { parameter: "MCV", result: "92", unit: "fL", referenceRange: "80–100", flag: "Normal" },
      { parameter: "RBC", result: "4.85", unit: "million/µL", referenceRange: "4.2–5.4", deviation: "-1%", flag: "Normal" },
      { parameter: "MCH", result: "30", unit: "pg", referenceRange: "27–33", deviation: "-1%", flag: "Normal" },
      { parameter: "MCHC", result: "33", unit: "g/dL", referenceRange: "32–36", deviation: "+4%", flag: "Normal" },
    ],
  },
};

const FlagDot: React.FC<{ flag?: ParamRow["flag"] }> = ({ flag }) => {
  if (flag === "High") return <span className="h-3 w-3 rounded-full bg-red-500 inline-block" />;
  if (flag === "Low") return <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />;
  if (flag === "Critical") return <span className="h-3 w-3 rounded-full bg-red-700 inline-block" />;
  return <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />;
};

export default function TestResultDetailPage(): JSX.Element {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();

  // local data state
  const [orderData, setOrderData] = useState<OrderData | undefined>(() => (orderNumber ? MOCK_DATA[orderNumber] : undefined));
  const [rowsState, setRowsState] = useState<ParamRow[]>(orderData?.rows ?? []);
  const [isReviewing, setIsReviewing] = useState(false);

  // keep a copy to revert if cancel during review
  const originalRowsRef = useRef<ParamRow[] | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      navigate(-1);
      return;
    }
    // load mock data (replace this with API call)
    const data = MOCK_DATA[orderNumber];
    setOrderData(data);
    setRowsState(data ? structuredClone(data.rows) : []);
    // cleanup review mode
    setIsReviewing(false);
    originalRowsRef.current = null;
  }, [orderNumber, navigate]);

  if (!orderNumber || !orderData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Result not found</h3>
          <p className="text-sm text-gray-600 mb-6">Cannot find test result {orderNumber}</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-md">Close</button>
          </div>
        </div>
      </div>
    );
  }

  // handlers
  const handleClose = () => {
    // if reviewing, prompt user? Here we treat Cancel (footer) when not reviewing as close.
    if (isReviewing) {
      // if user tries to close while editing we treat as cancel review (revert)
      handleCancelReview();
      return;
    }
    navigate(-1);
  };

  const handleStartReview = () => {
    // save original copy for revert and enable editing
    originalRowsRef.current = structuredClone(rowsState);
    setIsReviewing(true);
  };

  const handleCancelReview = () => {
    if (originalRowsRef.current) {
      setRowsState(structuredClone(originalRowsRef.current));
    }
    originalRowsRef.current = null;
    setIsReviewing(false);
  };

  const handleSaveReview = () => {
    // here you would call API to save; for demo update MOCK_DATA and local state
    if (orderNumber) {
      MOCK_DATA[orderNumber].rows = structuredClone(rowsState);
      setOrderData((d) => (d ? { ...d, rows: structuredClone(rowsState) } : d));
    }
    originalRowsRef.current = null;
    setIsReviewing(false);
    alert("Saved review changes (mock).");
  };

  const handleFieldChange = (index: number, field: keyof ParamRow, value: string) => {
    setRowsState((prev) => {
      const copy = prev.map((r) => ({ ...r }));
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDownloadPdf = () => {
    alert("Downloading PDF (placeholder)");
  };

  const handleViewHL7 = () => {
    alert("View Raw HL7 (placeholder)");
  };

  const handleReview = () => {
    if (isReviewing) handleSaveReview();
    else handleStartReview();
  };

  // derived counts
  const total = rowsState.length;
  const normal = rowsState.filter((r) => !r.flag || r.flag === "Normal").length;
  const high = rowsState.filter((r) => r.flag === "High").length;
  const low = rowsState.filter((r) => r.flag === "Low").length;

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        onClick={() => {
          // clicking backdrop while reviewing should confirm cancel review
          if (isReviewing) {
            handleCancelReview();
            return;
          }
          navigate(-1);
        }}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] mx-auto overflow-hidden relative">
          <div className="flex">
            {/* Left - main table area */}
            <div className="flex-1 p-8">
              {/* Title row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Complete Blood Count (CBC)</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    {orderNumber} • {orderData.patientName}
                    <span className="mx-2">•</span>
                    Sex: {orderData.sex}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Collected: {orderData.collected}</div>
                  <div className="text-sm text-gray-500">Instrument: {orderData.instrument}</div>
                  <div className="mt-3 inline-flex items-center gap-2">
                    <span className="inline-block bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {orderData.criticalCount} Critical Values
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
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
                    {rowsState.map((r, idx) => {
                      const isHighlighted = r.flag === "High" || r.flag === "Critical" || r.flag === "Low";
                      return (
                        <tr key={r.parameter} className="align-top border-b border-gray-100">
                          <td className="py-4 pr-6 font-semibold text-gray-700 w-48">{r.parameter}</td>

                          {/* Result (editable in review) */}
                          <td className="py-4 pr-6">
                            {isReviewing ? (
                              <input
                                type="text"
                                value={r.result}
                                onChange={(e) => handleFieldChange(idx, "result", e.target.value)}
                                className="w-36 px-2 py-1 border rounded text-sm"
                              />
                            ) : (
                              <div className={`inline-block px-3 py-1 rounded ${isHighlighted ? "bg-red-50 text-red-700 font-semibold" : ""}`}>
                                {r.result}
                              </div>
                            )}
                          </td>

                          <td className="py-4 pr-6 text-sm text-gray-600">{r.unit}</td>
                          <td className="py-4 pr-6 text-sm text-gray-600">{r.referenceRange}</td>

                          {/* Deviation (editable) */}
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
                              <FlagDot flag={r.flag} />
                              <span className="text-sm text-gray-600">{r.flag ?? "Normal"}</span>
                            </div>
                          </td>

                          {/* Applied Evaluate (editable) */}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* comment and more */}
             
            </div>

            {/* Right - summary & actions */}
            <div className="w-[320px] p-6 bg-transparent border-l border-gray-100">
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Summary</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex justify-between"><span>Total tests</span><strong>{total}</strong></li>
                    <li className="flex justify-between"><span>Normal</span><strong>{normal}</strong></li>
                    <li className="flex justify-between"><span>High</span><strong>{high}</strong></li>
                    <li className="flex justify-between"><span>Low</span><strong>{low}</strong></li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Reviewed</h4>
                  <div className="text-sm text-gray-600">By</div>
                  <div className="mt-3 text-sm font-medium">AI Auto Review</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:shadow"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleViewHL7}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:shadow"
                    >
                      View Raw HL7
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions: comment left, buttons right.
              - If reviewing: Cancel = revert & exit review, primary = Save
              - If not reviewing: Cancel = close modal, primary = Review */}
          <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              <div>
                <strong>Comment:</strong> Empty
              </div>
              <div className="mt-2">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 underline">More comment</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:shadow"
              >
                {isReviewing ? "Cancel" : "Cancel"}
              </button>

              <button
                onClick={handleReview}
                className={`px-4 py-2 rounded-lg text-sm ${isReviewing ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {isReviewing ? "Save" : "Review"}
              </button>
            </div>
          </div>

          {/* Close icon */}
          <button
            onClick={() => {
              if (isReviewing) handleCancelReview();
              else navigate(-1);
            }}
            aria-label="Close"
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow hover:bg-gray-50"
          >
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
