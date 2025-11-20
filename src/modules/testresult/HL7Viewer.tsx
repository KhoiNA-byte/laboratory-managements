// src/modules/testorder/HL7Viewer.tsx
import React, { useMemo, useState } from "react";
import {
  XMarkIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { TestParameter } from "../../types/testResult";
import { exportFile } from "../../utils/exportFile";

function detectObxFlag(line: string): "High" | "Low" | "Normal" {
  // Simple heuristics:
  // - HL7 OBX has a result status field like |H| or |L| (commonly field 8 or 11)
  // - also some messages append textual "High" / "Low" in trailing fields
  const up = line.toUpperCase();
  if (/(\|H\|)|\bHIGH\b/.test(up)) return "High";
  if (/(\|L\|)|\bLOW\b/.test(up)) return "Low";
  return "Normal";
}

export default function HL7Viewer({
  // Basic info
  testOrderId,
  patient,
  date,
  tester,
  status,
  sex,
  orderNumber,
  // Parameters
  parameters,
  // HL7
  rawHL7,
  onClose,
}: {
  testOrderId: string;
  patient: string;
  date: string;
  tester: string;
  status: string;
  sex: string;
  orderNumber: string;
  parameters: TestParameter[];
  rawHL7: string;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [highlightAbnormal, setHighlightAbnormal] = useState(false);
  const [onlyObx, setOnlyObx] = useState(false);

  // prepare lines and metadata
  const lines = useMemo(() => {
    if (!rawHL7) return [];
    // split preserving original line breaks - trim trailing newlines for tidy display
    return rawHL7
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.replace(/\s+$/g, ""));
  }, [rawHL7]);

  const parsed = useMemo(() => {
    return lines.map((line, idx) => {
      const isObx = /^\s*OBX\|/i.test(line);
      const flag = isObx ? detectObxFlag(line) : "Normal";
      return { line, idx, isObx, flag };
    });
  }, [lines]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parsed.filter((p) => {
      if (onlyObx && !p.isObx) return false;
      if (!q) return true;
      return p.line.toLowerCase().includes(q);
    });
  }, [parsed, search, onlyObx]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rawHL7);
      alert("Copied HL7 to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const downloadHL7 = () => {
    // Gọi exportFile với đầy đủ data
    exportFile({
      testOrderId,
      patient,
      date,
      tester,
      status,
      sex,
      parameters,
      hl7_raw: rawHL7,
    });

    // Download file HL7

    // const blob = new Blob([rawHL7], { type: "text/plain;charset=utf-8" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `${orderNumber || "message"}.hl7`;
    // document.body.appendChild(a);
    // a.click();
    // a.remove();
    // URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto overflow-hidden">
        {/* header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                HL7 Message Viewer
              </h3>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <div className="flex gap-4">
                  <span>
                    <strong>Test Order:</strong> {testOrderId}
                  </span>
                  <span>
                    <strong>Patient:</strong> {patient}
                  </span>
                  <span>
                    <strong>Sex:</strong> {sex}
                  </span>
                  <span>
                    <strong>Date:</strong> {date}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span>
                    <strong>Tester:</strong> {tester}
                  </span>
                  <span>
                    <strong>Status:</strong> {status}
                  </span>
                  <span>
                    <strong>Run ID:</strong> {orderNumber}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                OBX total: {parsed.filter((p) => p.isObx).length} — High:{" "}
                {parsed.filter((p) => p.flag === "High").length} — Low:{" "}
                {parsed.filter((p) => p.flag === "Low").length}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-3 py-1 border rounded-md text-sm hover:shadow"
              >
                <DocumentDuplicateIcon className="h-4 w-4" /> Copy
              </button>
              <button
                onClick={downloadHL7}
                className="px-3 py-1 border rounded-md text-sm hover:shadow"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* search + quick actions */}
        <div className="px-6 py-4 border-b border-gray-100 items-start">
          <div className="col-span-2 flex items-center gap-2">
            <input
              placeholder="Find ( OBX, parameter, value)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={() => {}}
              className=" border rounded px-3 py-2 text-sm bg-gray-200"
            >
              Find
            </button>
          </div>
        </div>

        {/* body */}
        <div className="px-6 py-4 max-h-[65vh] overflow-auto text-xs">
          {" "}
          <div className="flex gap-4">
            <div className="w-3/4 bg-gray-50 rounded border p-3 overflow-auto max-h-[60vh]">
              {filtered.length === 0 ? (
                <div className="text-xs text-gray-500 py-6 text-center">
                  No lines match the filter.
                </div>
              ) : (
                <div className="text-xs leading-relaxed font-mono">
                  {filtered.map((p) => {
                    const baseClass =
                      "py-2 px-3 rounded mb-1 break-words whitespace-pre-wrap";
                    let cls = "text-gray-800";

                    if (highlightAbnormal && p.isObx) {
                      if (p.flag === "High")
                        cls =
                          "bg-red-50 text-red-800 border-l-4 border-red-400";
                      else if (p.flag === "Low")
                        cls =
                          "bg-amber-50 text-amber-800 border-l-4 border-amber-400";
                    }

                    return (
                      <div key={p.idx} className={`${baseClass} ${cls}`}>
                        {p.line}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-3 text-[10px] text-gray-500">
                Use parsed view to see mapped OBX values. Download raw HL7 to
                debug integration issues.
              </div>
            </div>
            <div className="w-1/4 bg-white border rounded-md p-3">
              <div className="font-semibold text-gray-700 mb-2 text-sm">
                Quick Actions
              </div>

              <div className="space-y-2 ">
                <button
                  onClick={() => setHighlightAbnormal((v) => !v)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    highlightAbnormal ? "bg-gray-600" : "bg-gray-50"
                  } text-xs`}
                >
                  Highlight ABNORMAL (H/L)
                </button>

                <button
                  onClick={() => {
                    setOnlyObx(true);
                  }}
                  className={`w-full text-left px-3 py-2 rounded ${
                    onlyObx ? "bg-gray-600" : "bg-gray-50"
                  } text-xs`}
                >
                  Show only OBX lines
                </button>

                <button
                  onClick={() => {
                    setOnlyObx(false);
                    setHighlightAbnormal(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded ${
                    onlyObx ? "bg-gray-50" : "bg-gray-600"
                  } text-xs`}
                >
                  Show all lines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Raw HL7 viewer — sensitive data. Access is logged for audit.
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border text-sm text-gray-700"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
