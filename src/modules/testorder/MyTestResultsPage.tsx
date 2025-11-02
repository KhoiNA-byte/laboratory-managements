// src/pages/MyTestResultsPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

type Row = {
  id: string;
  patientName: string;
  date: string;
  tester: string;
  status: "Completed" | "In Progress";
};

const initialRows: Row[] = [
  {
    id: "TO-2025-005",
    patientName: "Tran Gia Huy",
    date: "10/16/2025, 8:35:00 AM",
    tester: "Dr. Sarah Johnson",
    status: "Completed",
  },
  {
    id: "TO-2025-006",
    patientName: "Nguyen Van A",
    date: "10/15/2025, 10:10:00 AM",
    tester: "Lab Tech - Ronaldo",
    status: "In Progress",
  },
];

const Badge: React.FC<{ status: Row["status"] }> = ({ status }) =>
  status === "Completed" ? (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
      Completed
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-400 text-white">
      In Progress
    </span>
  );

const MyTestResultsPage: React.FC = () => {
  const [rows] = useState<Row[]>(initialRows);
  const [search, setSearch] = useState("");
  const total = rows.length;
  const pending = rows.filter((r) => r.status === "In Progress").length;
  const completed = rows.filter((r) => r.status === "Completed").length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.tester.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNewTest = () => {
    // TODO: open modal or navigate to new test page
    alert("Creating new test order...");
  };

  // IMPORTANT: pass current location as "background" so the modal route
  // can be rendered on top of current page
  const handleView = (orderNumber: string) => {
    navigate(`/admin/test-results/${orderNumber}`, {
      state: { background: location },
    });
  };

  const handleExport = (id: string) => {
    alert(`Exporting test result for ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        {/* summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* ... cards as before ... */}
        </div>

        {/* panel */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Test Results
                </h1>
                <p className="text-sm text-gray-600">
                  Your laboratory test history and results
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tests..."
                    className="w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleNewTest}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Test
                </button>
              </div>
            </div>
          </div>

          {/* table (kept identical) */}
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr className="text-center text-sm text-gray-600">
                    <th className="px-6 py-4">TestOrder ID</th>
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Tester</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y text-center divide-gray-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {r.id}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {r.patientName}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {r.date}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {r.tester}
                      </td>
                      <td className="px-6 py-5">
                        <Badge status={r.status} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center items-center space-x-3">
                          <button
                            onClick={() => handleView(r.id)}
                            className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:shadow"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleExport(r.id)}
                            className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:shadow"
                          >
                            Export
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        No test results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTestResultsPage;
