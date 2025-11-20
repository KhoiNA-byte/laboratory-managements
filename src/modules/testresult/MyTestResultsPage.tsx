// src/pages/MyTestResultsPage.tsx
import {
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewTest from "./NewTest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchListRequest,
  deleteResultRequest,
  fetchDetailRequest,
  ListRow,
} from "../../store/slices/testResultsSlice";
import { TestParameter } from "../../types/testResult";

const MyTestResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Results");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [fetchingRowId, setFetchingRowId] = useState<string | number | null>(
    null
  );

  const list = useSelector((s: RootState) => s.testResults.list);
  const loading = useSelector((s: RootState) => s.testResults.loadingList);
  const deleting = useSelector((s: RootState) => s.testResults.deleting);

  useEffect(() => {
    dispatch(fetchListRequest());
  }, [dispatch]);
  useEffect(() => {
    console.log("DEBUG testResults.list:", list);
  }, [list]);
  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return list.filter((r) => {
      if (activeTab === "Completed" && r.status !== "Completed") return false;
      if (activeTab === "In Progress" && r.status !== "In Progress")
        return false;
      if (!q) return true;
      return (
        String(r.id).toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.tester.toLowerCase().includes(q)
      );
    });
  }, [list, activeTab, searchTerm]);

  const total = list.length;
  const pending = list.filter((r) => r.status === "In Progress").length;
  const completed = list.filter((r) => r.status === "Completed").length;

  const handleNew = () => setIsNewOpen(true);

  const onNewTestCreated = (runIdOrResultId: string | number) => {
    setIsNewOpen(false);
    // refresh then navigate
    dispatch(fetchListRequest());
    navigate(`/admin/test-results/${String(runIdOrResultId)}`, {
      state: { background: location },
    });
  };

  // IMPORTANT: only navigate if we actually have a runId (result ready)
  const handleView = async (row: ListRow) => {
    const orderNumber = row.runId ?? row.id;
    if (!orderNumber) {
      // defensive: shouldn't happen if button is disabled in UI
      window.alert("Cannot view: this test is still pending (no result yet).");
      return;
    }

    try {
      // Set loading state
      setFetchingRowId(row.id);

      // Fetch detail để lấy parameters
      dispatch(fetchDetailRequest(String(orderNumber)));

      // Wait for detail in saga then get from store
      // For now, navigate immediately and let TestResultDetailPage handle the fetch
      // But we'll pass empty parameters first, then TestResultDetailPage will use its own fetch

      navigate(`/admin/test-results/${String(orderNumber)}`, {
        state: {
          background: location,
          testOrderId: String(row.id),
          patient: row.patientName,
          date: row.date,
          tester: row.tester,
          status: row.status,
          runId: orderNumber,
        },
      });
    } catch (error) {
      console.error("Failed to navigate:", error);
      window.alert("Failed to open test details. Please try again.");
    } finally {
      setFetchingRowId(null);
    }
  };

  const handleExport = (id: string) => alert(`Exporting ${id} (mock)`);

  const handleDelete = (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    dispatch(deleteResultRequest(id));
  };

  const getStatusBadgeColor = (status: ListRow["status"]) =>
    status === "Completed"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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

            <div className="flex justify-end gap-2">
              {/* <button
                onClick={() => dispatch(fetchListRequest())}
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Sync-Test
              </button> */}

              <button
                onClick={handleNew}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                + New Test
              </button>
            </div>
          </div>

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
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
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
                {filteredRows.map((r) => {
                  const viewDisabled = r.status === "In Progress" || !r.runId;
                  const isFetching = fetchingRowId === r.id;
                  return (
                    <tr
                      key={`${r.source}-${r.id}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          {r.id !== undefined ? r.id : "Unknown"}
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
                          onClick={() =>
                            viewDisabled
                              ? window.alert(
                                  "This test is pending — result not available to view yet."
                                )
                              : handleView(r)
                          }
                          className={`px-3 py-1 border border-gray-200 rounded-md text-sm ${
                            viewDisabled || isFetching
                              ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                              : "hover:shadow bg-white"
                          }`}
                          disabled={viewDisabled || isFetching}
                          title={
                            viewDisabled
                              ? "Cannot view pending result"
                              : isFetching
                              ? "Loading..."
                              : "View result"
                          }
                        >
                          {isFetching ? (
                            <span className="flex items-center gap-1">
                              <svg
                                className="animate-spin h-3 w-3"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Loading
                            </span>
                          ) : (
                            "View"
                          )}
                        </button>
                        <button
                          onClick={() => handleExport(r.id)}
                          className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:shadow ml-2"
                        >
                          Export
                        </button>
                        <button
                          onClick={() => handleDelete(r.runId ?? r.id)}
                          className="px-3 py-1 border border-red-200 rounded-md text-sm hover:shadow ml-2 text-red-600"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}

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
          )}
        </div>
      </div>

      <NewTest
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onCreated={onNewTestCreated}
      />
    </div>
  );
};

export default MyTestResultsPage;
