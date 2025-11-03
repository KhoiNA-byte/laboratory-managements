// src/pages/MyTestResultsPage.tsx
import {
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Row = {
  id: string;
  patientName: string;
  date: string;
  tester: string;
  status: "Completed" | "In Progress";
};

export const MyTestResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Results");
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(
    null
  );

  // mock data
  const mockRows: Row[] = [
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
    {
      id: "TO-2025-007",
      patientName: "Pham Minh Tuan",
      date: "10/14/2025, 9:50:00 AM",
      tester: "Dr. Emily Carter",
      status: "Completed",
    },
    {
      id: "TO-2025-008",
      patientName: "Le Thi Thanh",
      date: "10/13/2025, 11:20:00 AM",
      tester: "Lab Tech - Ronaldo",
      status: "In Progress",
    },
    {
      id: "TO-2025-009",
      patientName: "Hoang Duc Hieu",
      date: "10/12/2025, 2:45:00 PM",
      tester: "Dr. Michael Smith",
      status: "Completed",
    },
    {
      id: "TO-2025-010",
      patientName: "Truong Quang",
      date: "10/11/2025, 1:15:00 PM",
      tester: "Lab Tech - Maria Lopez",
      status: "In Progress",
    },
    {
      id: "TO-2025-011",
      patientName: "Tran Thi Kieu",
      date: "10/10/2025, 4:05:00 PM",
      tester: "Dr. Sarah Johnson",
      status: "Completed",
    },
    {
      id: "TO-2025-012",
      patientName: "Nguyen Thi Hoa",
      date: "10/09/2025, 9:00:00 AM",
      tester: "Dr. Emily Carter",
      status: "Completed",
    },
    {
      id: "TO-2025-013",
      patientName: "Pham Van Binh",
      date: "10/08/2025, 10:30:00 AM",
      tester: "Lab Tech - Ronaldo",
      status: "In Progress",
    },
    {
      id: "TO-2025-014",
      patientName: "Le Van Duc",
      date: "10/07/2025, 3:15:00 PM",
      tester: "Dr. Michael Smith",
      status: "Completed",
    },
    {
      id: "TO-2025-015",
      patientName: "Hoang Thi Lan",
      date: "10/06/2025, 11:50:00 AM",
      tester: "Lab Tech - Maria Lopez",
      status: "In Progress",
    },
    {
      id: "TO-2025-016",
      patientName: "Tran Van Toan",
      date: "10/05/2025, 8:20:00 AM",
      tester: "Dr. Sarah Johnson",
      status: "Completed",
    },
    {
      id: "TO-2025-017",
      patientName: "Vu Thi My",
      date: "10/04/2025, 2:40:00 PM",
      tester: "Dr. Emily Carter",
      status: "Completed",
    },
    {
      id: "TO-2025-018",
      patientName: "Nguyen Van Long",
      date: "10/03/2025, 1:05:00 PM",
      tester: "Lab Tech - Ronaldo",
      status: "In Progress",
    },
    {
      id: "TO-2025-019",
      patientName: "Le Thi Mai",
      date: "10/02/2025, 9:30:00 AM",
      tester: "Dr. Michael Smith",
      status: "Completed",
    },
    {
      id: "TO-2025-020",
      patientName: "Pham Van Quang",
      date: "10/01/2025, 4:10:00 PM",
      tester: "Lab Tech - Maria Lopez",
      status: "In Progress",
    },
  ];

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return mockRows.filter((r) => {
      if (activeTab === "Completed" && r.status !== "Completed") return false;
      if (activeTab === "In Progress" && r.status !== "In Progress")
        return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.tester.toLowerCase().includes(q)
      );
    });
  }, [mockRows, activeTab, searchTerm]);

  const total = mockRows.length;
  const pending = mockRows.filter((r) => r.status === "In Progress").length;
  const completed = mockRows.filter((r) => r.status === "Completed").length;

  const handleNew = () => {
    navigate("/admin/test-results/new");
  };

  const handleView = (orderNumber: string) => {
    navigate(`/admin/test-results/${orderNumber}`, {
      state: { background: location },
    });
  };

  const handleExport = (id: string) => {
    alert(`Exporting ${id} (mock)`);
  };

  const getStatusBadgeColor = (status: Row["status"]) =>
    status === "Completed"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {/* Summary cards (top) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-100">
              <DocumentTextIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Results
              </p>
              <p className="text-3xl font-bold text-gray-900">{pending}</p>
              <p className="text-sm text-gray-500 mt-1">In progress</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completed}</p>
              <p className="text-sm text-gray-500 mt-1">Available to view</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-100">
              <CheckCircleIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Test Results
              </h3>
              <p className="text-sm text-gray-600">
                Your laboratory test results and history
              </p>
            </div>

            <button
              onClick={handleNew}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg
                className="h-4 w-4"
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

          {/* Tabs */}
          <div className="flex space-x-8 mb-4">
            {["All Results", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex justify-end">
            <div className="relative w-64">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search results..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TestOrder ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {r.id}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {r.patientName}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.date}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {r.tester}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
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
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyTestResultsPage;
