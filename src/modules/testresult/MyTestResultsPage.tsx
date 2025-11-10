// src/pages/MyTestResultsPage.tsx
import {
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewTest from "./NewTest";
import axios from "axios";

type Row = {
  id: string; // display id (order id or order id matched to result)
  patientName: string;
  date: string;
  tester: string;
  status: "Completed" | "In Progress";
  source: "order" | "result";
  runId?: string;
};

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";

export const MyTestResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Results");
  const [isNewOpen, setIsNewOpen] = useState(false);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTestList = async () => {
    setLoading(true);
    try {
      const [ordersRes, resultsRes] = await Promise.all([
        axios.get(`${API_BASE}/test_order`),
        axios.get(`${API_BASE}/test_results`),
      ]);
      const orders: any[] = ordersRes.data ?? [];
      const results: any[] = resultsRes.data ?? [];

      // 1) In-process: orders with no run_id
      const inProcessRows: Row[] = orders
        .filter((o) => o.run_id === undefined || o.run_id === null || String(o.run_id).trim() === "")
        .map((o) => {
          const dateRaw = o.created_at ?? "";
          const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";
          return {
            id: String(o.id),
            patientName: o.patientName ?? "Unknown",
            date,
            tester: "Admin",
            status: "In Progress",
            source: "order",
            runId: undefined,
          } as Row;
        });

      // 2) Completed: test_results with status Completed
      const completedResults = (results || []).filter((r) => String(r.status).toLowerCase() === "completed");
      const completedRows: Row[] = completedResults.map((r) => {
        // match order by run_id if possible
        const matchedOrder = orders.find((o) => o.run_id && r.run_id && String(o.run_id) === String(r.run_id));
        const dateRaw = r.performed_at ?? r.created_at ?? (matchedOrder ? matchedOrder.created_at : "");
        const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";
        return {
          id: matchedOrder ? String(matchedOrder.id) : `R-${String(r.id)}`,
          patientName: matchedOrder?.patientName ?? r.patientName ?? "Unknown",
          date,
          tester: "Admin",
          status: "Completed",
          source: "result",
          runId: r.run_id ? String(r.run_id) : undefined,
        } as Row;
      });

      // remove any inProcess that have a corresponding completed order (by id)
      const completedOrderIds = new Set(completedRows.map((c) => c.id));
      const finalRows = [
        ...inProcessRows.filter((r) => !completedOrderIds.has(r.id)),
        ...completedRows,
      ];

      setRows(finalRows);
    } catch (err) {
      console.error("Failed to fetch test list", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((r) => {
      if (activeTab === "Completed" && r.status !== "Completed") return false;
      if (activeTab === "In Progress" && r.status !== "In Progress") return false;
      if (!q) return true;
      return (
        String(r.id).toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.tester.toLowerCase().includes(q)
      );
    });
  }, [rows, activeTab, searchTerm]);

  const total = rows.length;
  const pending = rows.filter((r) => r.status === "In Progress").length;
  const completed = rows.filter((r) => r.status === "Completed").length;

  const handleNew = () => setIsNewOpen(true);

  const onNewTestCreated = (runIdOrResultId: string | number) => {
    setIsNewOpen(false);
    // refresh then navigate to detail by run_id
    fetchTestList().finally(() => {
      navigate(`/admin/test-results/${String(runIdOrResultId)}`, { state: { background: location } });
    });
  };

  const handleView = (orderNumber: string) => {
    navigate(`/admin/test-results/${orderNumber}`, { state: { background: location } });
  };

  const handleExport = (id: string) => alert(`Exporting ${id} (mock)`);

  const getStatusBadgeColor = (status: Row["status"]) =>
    status === "Completed" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800";

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
              <p className="text-sm font-medium text-gray-600">Pending Results</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
              <p className="text-sm text-gray-600">Your laboratory test results and history</p>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => fetchTestList()} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Sync-Test
              </button>

              <button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                New Test
              </button>
            </div>
          </div>

          <div className="flex space-x-8 mb-4">
            {["All Results", "In Progress", "Completed"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="relative w-64">
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search results..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? <div className="p-6 text-center text-gray-500">Loading...</div> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TestOrder ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRows.map((r) => (
                  <tr key={`${r.source}-${r.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-blue-600">{r.id}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{r.patientName}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.tester}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(r.status)}`}>{r.status}</span></td>
                    <td className="px-6 py-5">
                      <button onClick={() => handleView(r.runId ?? r.id)} className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:shadow">View</button>
                      <button onClick={() => handleExport(r.id)} className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:shadow ml-2">Export</button>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">No results found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <NewTest isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} onCreated={onNewTestCreated} />
    </div>
  );
};

export default MyTestResultsPage;
