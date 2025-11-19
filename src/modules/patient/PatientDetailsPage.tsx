import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../../services/patientApi";
import type { Patient, TestOrder } from "../../services/patientApi";

export const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/admin/patients"); // Nếu không có ID, quay lại
      return;
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPatientById(id);
        setPatient(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, navigate]);

  // If patient not found, redirect back to patients list
  if (!patient) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Patient Not Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The patient with ID "{id}" could not be found.
            </p>
            <div className="mt-4">
              <Link
                to="/admin/patients"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Patients
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-orange-100 text-orange-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIcon = (iconName: string) => {
    const icons = {
      person: (
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      calendar: (
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      phone: (
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      email: (
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      location: (
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      document: (
        <svg
          className="h-5 w-5 text-gray-400"
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
      ),
      clock: (
        <svg
          className="h-5 w-5 text-gray-400"
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
      ),
      chart: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
    };
    return icons[iconName as keyof typeof icons] || null;
  };

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      // Kiểm tra nếu ngày tháng không hợp lệ
      if (isNaN(date.getTime())) {
        console.warn(
          "Invalid date string provided to formatDateTime:",
          dateString
        );
        return "N/A";
      }

      return date.toLocaleDateString("vi-VN");
    } catch (error) {
      console.error("Error in formatDateTime function:", error);
      return "N/A";
    }
  };

  const getSummaryStats = (patient: Patient) => {
    const orders = patient.test_orders || [];

    const totalTests = orders.length;
    const pendingTests = orders.filter(
      (order) => order.status === "In Progress" || order.status === "Pending"
    ).length;

    // Lấy "Last Visit" từ patient.updatedAt và định dạng nó
    const lastVisitValue = formatDateTime(patient.updatedAt);

    return [
      {
        title: "Total Tests",
        value: totalTests.toString(),
        icon: "document",
      },
      {
        title: "Pending",
        value: pendingTests.toString(),
        icon: "clock",
      },
      {
        title: "Last Visit",
        value: lastVisitValue,
      },
    ];
  };

  // 6. XỬ LÝ TRẠNG THÁI LOADING
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading patient data...</p>
        {/* Bạn có thể thêm spinner ở đây */}
      </div>
    );
  }

  // 7. XỬ LÝ TRẠNG THÁI ERROR
  if (error) {
    return (
      <div className="space-y-6">
        {/* Dùng markup error từ file gốc */}
        <div className="text-center py-12">
          <div className="text-gray-500">
            {/* (Biểu tượng SVG từ file gốc) */}
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Error Loading Patient
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-4">
              <Link
                to="/admin/patients"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {/* (Biểu tượng SVG back từ file gốc) */}
                Back to Patients
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const summaryStats = getSummaryStats(patient);
  // Sắp xếp test order mới nhất lên đầu (dựa vào orderedAt)
  const recentActivity =
    patient.test_orders
      ?.sort(
        (a, b) =>
          new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
      )
      .slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Patient Details
            </h1>
            <p className="text-gray-600 text-sm">
              View and manage patient information
            </p>
          </div>
        </div>

        {/* Back to Patients Link */}
        <div className="mt-3">
          <Link
            to="/admin/patients"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Patients
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Patient Avatar and Basic Info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">
                  {patient.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {patient.name}
              </h2>
              <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {patient.id}
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                {getIcon("person")}
                <span className="ml-3 text-gray-700 text-sm">
                  {patient.age} years / {patient.gender}
                </span>
              </div>
              <div className="flex items-center">
                {getIcon("phone")}
                <span className="ml-3 text-gray-700 text-sm">
                  {patient.phone}
                </span>
              </div>
              <div className="flex items-center">
                {getIcon("email")}
                <span className="ml-3 text-gray-700 text-sm">
                  {patient.email && patient.email.trim()
                    ? patient.email
                    : "_No email_"}
                </span>
              </div>
              <div className="flex items-center">
                {getIcon("location")}
                <span className="ml-3 text-gray-700 text-sm">
                  {patient.address}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate(`/admin/patients/${patient.id}/edit`)} // 👉 điều hướng tới trang edit
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Patient
            </button>
          </div>
        </div>

        {/* Right Column - Patient Activity and Summaries */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-6 px-6">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "test-history", label: "Test History" },
                  // { id: "documents", label: "Documents" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Latest test orders and results
                    </p>

                    <div className="space-y-2">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            {getIcon("chart")}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.testType}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(
                                  activity.orderedAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                activity.status
                              )}`}
                            >
                              {activity.status}
                            </span>
                            <span className="text-sm text-gray-600">
                              {activity.note}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {summaryStats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getIcon(stat.icon)}
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">
                              {stat.title}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {stat.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "test-history" && (
                <div>
                  {/* 1. Kiểm tra nếu không có test_orders hoặc mảng rỗng */}
                  {!patient.test_orders || patient.test_orders.length === 0 ? (
                    // 1a. Hiển thị thông báo "Không có dữ liệu"
                    <div className="text-center py-12">
                      <div className="text-gray-500">
                        {/* Biểu tượng (Icon) */}
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No Test History
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          This patient does not have any test orders yet.
                        </p>
                      </div>
                    </div>
                  ) : (
                    // 1b. Hiển thị bảng nếu có dữ liệu
                    <div className="flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              {/* 2. Tiêu đề bảng (Header) */}
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                  >
                                    Test Type
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Ordered At
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Tester
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Note
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Test ID
                                  </th>
                                </tr>
                              </thead>
                              {/* 3. Nội dung bảng (Body) */}
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {
                                  // Sắp xếp: test mới nhất lên đầu
                                  [...patient.test_orders]
                                    .sort(
                                      (a, b) =>
                                        new Date(b.orderedAt).getTime() -
                                        new Date(a.orderedAt).getTime()
                                    )
                                    .map((order) => (
                                      <tr key={order.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                          {order.testType}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {/* Dùng hàm formatDateTime */}
                                          {formatDateTime(order.orderedAt)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {/* Dùng hàm getStatusBadgeColor */}
                                          <span
                                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                              order.status
                                            )}`}
                                          >
                                            {order.status}
                                          </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {order.tester || "N/A"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {order.note || "N/A"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {order.id}
                                        </td>
                                      </tr>
                                    ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* {activeTab === "documents" && (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Documents
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Patient documents will be displayed here.
                    </p>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
