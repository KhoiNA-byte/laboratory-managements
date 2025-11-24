import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getListTestOrder,
  TestOrderWithUser,
  deleteTestOrder,
} from "../../services/testOrderApi";

// Helper function to get badge styles
const getBadgeStyles = (type: "priority" | "status", variant: string) => {
  if (type === "priority") {
    switch (variant) {
      case "Stat":
        return "bg-red-50 text-red-800";
      case "Urgent":
        return "bg-yellow-50 text-yellow-800";
      case "Routine":
        return "bg-green-50 text-green-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  } else {
    switch (variant) {
      case "Pending":
        return "bg-yellow-50 text-yellow-800";
      case "In Progress":
        return "bg-orange-50 text-orange-700";
      case "Completed":
        return "bg-blue-50 text-blue-800";
      case "Reviewed":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
};

export const TestOrdersPage = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  // Get user from Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(
    null
  );
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const [testOrders, setTestOrders] = useState<TestOrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const orderPerPage = 4;

  // Fetch test orders from API
  useEffect(() => {
    const fetchTestOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use user from Redux store
        const userRole = user?.role || "";
        const userId = user?.id || "";

        console.log("User Data from Redux:", user);

        const result = await getListTestOrder(userRole, userId);

        if (result.success) {
          setTestOrders(result.data);
        } else {
          setError(result.message || "Failed to fetch test orders");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching test orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestOrders();
  }, [user]);

  const handleViewDetails = (orderNumber: string) => {
    console.log("View Details clicked for:", orderNumber);
    navigate(`/admin/test-orders/${orderNumber}`);
  };

  const handleUpdateOrder = (orderNumber: string) => {
    console.log("Update order:", orderNumber);
    setShowActionsDropdown(null);
    navigate(`/admin/test-orders/${orderNumber}/edit`);
  };

  const handleDeleteOrder = async (orderNumber: string) => {
    // Confirm deletion
    const confirmDelete = window.confirm(
      t("testOrdersPage.table.confirmDelete", { orderNumber })
    );

    if (!confirmDelete) {
      setShowActionsDropdown(null);
      return;
    }

    try {
      console.log("Delete order:", orderNumber);
      const result = await deleteTestOrder(orderNumber);

      if (result.success) {
        // Remove the deleted order from state
        setTestOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderNumber !== orderNumber)
        );
        alert("Test order deleted successfully");
      } else {
        alert(
          `Failed to delete test order: ${result.message || "Unknown error"}`
        );
      }
    } catch (err) {
      console.error("Error deleting test order:", err);
      alert("An error occurred while deleting the test order");
    } finally {
      setShowActionsDropdown(null);
    }
  };

  const handleToggleDropdown = (orderNumber: string) => {
    if (showActionsDropdown === orderNumber) {
      setShowActionsDropdown(null);
    } else {
      const button = actionButtonRefs.current[orderNumber];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 5,
          left: rect.right - 192, // 192px = 12rem (dropdown width)
        });
      }
      setShowActionsDropdown(orderNumber);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionsDropdown) {
        const target = event.target as HTMLElement;
        const isInsideDropdown = target.closest("[data-dropdown-menu]");
        const isInsideButton = target.closest("[data-dropdown-button]");

        if (!isInsideDropdown && !isInsideButton) {
          setShowActionsDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsDropdown]);

  const handleNewOrder = () => {
    navigate("/admin/test-orders/new");
  };

  const filteredOrders = testOrders.filter((order) => {
    // Filter by active tab
    const matchesTab = activeTab === "all" || order.status === activeTab;

    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.testType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / orderPerPage);
  const startIndex = (currentPage - 1) * orderPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + orderPerPage
  );

  //Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Calculate counts for summary cards
  const statusCounts = {
    pending: testOrders.filter((order) => order.status === "Pending").length,
    inProgress: testOrders.filter((order) => order.status === "In Progress")
      .length,
    completed: testOrders.filter((order) => order.status === "Completed")
      .length,
    reviewed: testOrders.filter((order) => order.status === "Reviewed").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t("testOrdersPage.summaryCards.pending")}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {statusCounts.pending}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t("testOrdersPage.summaryCards.pendingSubtitle")}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t("testOrdersPage.summaryCards.inProgress")}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {statusCounts.inProgress}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t("testOrdersPage.summaryCards.inProgressSubtitle")}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t("testOrdersPage.summaryCards.completed")}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {statusCounts.completed}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t("testOrdersPage.summaryCards.completedSubtitle")}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Reviewed Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t("testOrdersPage.summaryCards.reviewed")}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {statusCounts.reviewed}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t("testOrdersPage.summaryCards.reviewedSubtitle")}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* All Test Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible relative">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("testOrdersPage.allOrders.title")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("testOrdersPage.allOrders.subtitle")}
              </p>
            </div>
            <button
              onClick={handleNewOrder}
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg border-none transition-colors duration-200 flex items-center gap-2 cursor-pointer hover:bg-blue-700"
            >
              <svg
                className="w-4 h-4"
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
              {t("testOrdersPage.filters.newOrder")}
            </button>
          </div>

          <div className="flex flex-row justify-between items-center">
            {/* Tabs */}
            <div className="flex gap-8 mb-4">
              {[
                { key: "all", label: t("testOrdersPage.filters.allOrders") },
                { key: "Pending", label: t("testOrdersPage.filters.pending") },
                {
                  key: "In Progress",
                  label: t("testOrdersPage.filters.inProgress"),
                },
                {
                  key: "Completed",
                  label: t("testOrdersPage.filters.completed"),
                },
                {
                  key: "Reviewed",
                  label: t("testOrdersPage.filters.reviewed"),
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-2 text-sm font-medium border-t-0 border-l-0 border-r-0 border-b-2 bg-transparent cursor-pointer transition-all duration-200 ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex justify-end mb-4">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder={t("testOrdersPage.filters.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
        </div>

        {/* Test Orders Table */}
        <div className="overflow-x-auto overflow-y-visible static">
          <table className="min-w-full border-collapse border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("testOrdersPage.table.orderNumber")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("testOrdersPage.table.patient")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("testOrdersPage.table.testType")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("testOrdersPage.table.priority")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("testOrdersPage.table.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("testOrdersPage.table.ordered")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("testOrdersPage.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr className="border-t border-gray-200">
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center whitespace-nowrap"
                  >
                    {t("testOrdersPage.table.loading")}
                  </td>
                </tr>
              ) : error ? (
                <tr className="border-t border-gray-200">
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center whitespace-nowrap text-red-600"
                  >
                    {t("testOrdersPage.table.error")}: {error}
                  </td>
                </tr>
              ) : currentOrders.length === 0 ? (
                <tr className="border-t border-gray-200">
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center whitespace-nowrap"
                  >
                    {t("testOrdersPage.table.noOrdersFound")}
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr
                    key={order.orderNumber}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.patient}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.testType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles(
                          "priority",
                          order.priority
                        )}`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles(
                          "status",
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.ordered}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative z-[1]">
                        <button
                          ref={(el) =>
                            (actionButtonRefs.current[order.orderNumber] = el)
                          }
                          data-dropdown-button
                          onClick={() =>
                            handleToggleDropdown(order.orderNumber)
                          }
                          className="text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {showActionsDropdown === order.orderNumber &&
                          ReactDOM.createPortal(
                            <div
                              style={{
                                position: "fixed",
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`,
                              }}
                              className="w-48 bg-white rounded-md shadow-xl z-[9999] border border-gray-200"
                              data-dropdown-menu
                            >
                              <div className="py-1">
                                <button
                                  onClick={() =>
                                    handleViewDetails(order.orderNumber)
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 bg-transparent border-none text-left cursor-pointer hover:bg-gray-50"
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  {t("testOrdersPage.table.viewDetails")}
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateOrder(order.orderNumber)
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 bg-transparent border-none text-left cursor-pointer hover:bg-gray-50"
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  {t("testOrdersPage.table.updateTestOrder")}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteOrder(order.orderNumber)
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 bg-transparent border-none text-left cursor-pointer hover:bg-gray-50"
                                >
                                  <svg
                                    className="w-4 h-4 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  {t("testOrdersPage.table.deleteTestOrder")}
                                </button>
                              </div>
                            </div>,
                            document.body
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Controls */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-center items-center mt-0 mb-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            {t("common.previous")}
          </button>
          <span className="text-sm text-gray-600">
            {t("common.page", { current: currentPage, total: totalPages })}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            {t("common.next")}
          </button>
        </div>
      )}
    </div>
  );
};
