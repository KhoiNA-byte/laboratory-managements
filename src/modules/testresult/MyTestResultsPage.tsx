// src/pages/MyTestResultsPage.tsx
import {
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewTest from "./NewTest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchListRequest,
  deleteResultRequest,
  ListRow,
} from "../../store/slices/testResultsSlice";

const MyTestResultsPage: React.FC = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isNewOpen, setIsNewOpen] = useState(false);

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
      if (activeTab === "completed" && r.status !== "Completed") return false;
      if (activeTab === "inProgress" && r.status !== "In Progress")
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
  const handleView = (orderNumber?: string | number) => {
    if (!orderNumber) {
      // defensive: shouldn't happen if button is disabled in UI
      window.alert("Cannot view: this test is still pending (no result yet).");
      return;
    }
    navigate(`/admin/test-results/${String(orderNumber)}`, {
      state: { background: location },
    });
  };

  const handleExport = (id: string) => alert(`Exporting ${id} (mock)`);

  const handleDelete = (id: string | number) => {
    if (!window.confirm(t("testResultsPage.table.confirmDelete"))) return;
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
              <p className="text-sm font-medium text-gray-600">{t("testResultsPage.summaryCards.totalTests")}</p>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-sm text-gray-500 mt-1">{t("testResultsPage.summaryCards.totalTestsSubtitle")}</p>
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
                {t("testResultsPage.summaryCards.pendingResults")}
              </p>
              <p className="text-3xl font-bold text-gray-900">{pending}</p>
              <p className="text-sm text-gray-500 mt-1">{t("testResultsPage.summaryCards.pendingResultsSubtitle")}</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("testResultsPage.summaryCards.completed")}</p>
              <p className="text-3xl font-bold text-gray-900">{completed}</p>
              <p className="text-sm text-gray-500 mt-1">{t("testResultsPage.summaryCards.completedSubtitle")}</p>
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
                {t("testResultsPage.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("testResultsPage.subtitle")}
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
                + {t("testResultsPage.filters.newTest")}
              </button>
            </div>
          </div>

          <div className="flex space-x-8 mb-4">
            {[
              { key: "all", label: t("testResultsPage.filters.allResults") },
              { key: "inProgress", label: t("testResultsPage.filters.inProgress") },
              { key: "completed", label: t("testResultsPage.filters.completed") },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="relative w-64">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("testResultsPage.filters.searchPlaceholder")}
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
            <div className="p-6 text-center text-gray-500">{t("common.loading")}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("testResultsPage.table.testOrderId")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("testResultsPage.table.patient")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("testResultsPage.table.date")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("testResultsPage.table.tester")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("testResultsPage.table.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("testResultsPage.table.actions")}
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRows.map((r) => {
                  const viewDisabled = r.status === "In Progress" || !r.runId;
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
                                  t("testResultsPage.table.cannotViewPending")
                                )
                              : handleView(r.runId ?? r.id)
                          }
                          className={`px-3 py-1 border border-gray-200 rounded-md text-sm ${
                            viewDisabled
                              ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                              : "hover:shadow bg-white"
                          }`}
                          disabled={viewDisabled}
                          title={
                            viewDisabled
                              ? t("testResultsPage.table.cannotViewTitle")
                              : t("testResultsPage.table.viewResultTitle")
                          }
                        >
                          {t("testResultsPage.table.view")}
                        </button>
                        <button
                          onClick={() => handleExport(r.id)}
                          className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:shadow ml-2"
                        >
                          {t("testResultsPage.table.export")}
                        </button>
                        <button
                          onClick={() => handleDelete(r.runId ?? r.id)}
                          className="px-3 py-1 border border-red-200 rounded-md text-sm hover:shadow ml-2 text-red-600"
                        >
                          {deleting ? t("testResultsPage.table.deleting") : t("testResultsPage.table.delete")}
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
                      {t("testResultsPage.table.noResultsFound")}
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
