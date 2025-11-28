import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Hooks
import { usePatientDetails } from "./hooks/usePatientDetails";

// Components
import { PatientDetailsHeader } from "./components/PatientDetailsHeader";
import { PatientInfoCard } from "./components/PatientInfoCard";
import { OverviewTab } from "./components/OverviewTab";
import { TestHistoryTab } from "./components/TestHistoryTab";
import { PatientNotFound } from "./components/PatientNotFound";

// Utils
import { formatDateTime } from "./utils";

export const PatientDetailsPage = () => {
  const { t } = useTranslation("common");
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { patient, loading, error } = usePatientDetails(id);

  const summaryStats = useMemo(() => {
    if (!patient) return [];

    const orders = patient.test_orders || [];
    const totalTests = orders.length;
    const pendingTests = orders.filter(
      (order) => order.status === "In Progress" || order.status === "Pending"
    ).length;
    const lastVisitValue = formatDateTime(patient.updatedAt);

    return [
      {
        title: t("patientDetails.summaryCards.totalTests"),
        value: totalTests.toString(),
        icon: "document",
      },
      {
        title: t("patientDetails.summaryCards.pending"),
        value: pendingTests.toString(),
        icon: "clock",
      },
      {
        title: t("patientDetails.summaryCards.lastVisit"),
        value: lastVisitValue,
      },
    ];
  }, [patient, t]);

  const recentActivity = useMemo(() => {
    if (!patient?.test_orders) return [];
    return [...patient.test_orders]
      .sort(
        (a, b) =>
          new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
      )
      .slice(0, 5);
  }, [patient]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Error Loading Patient
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-4">
              <Link
                to="/admin/patients"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Back to Patients
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return <PatientNotFound id={id} />;
  }

  return (
    <div className="space-y-6">
      <PatientDetailsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Information */}
        <div className="lg:col-span-1">
          <PatientInfoCard patient={patient} />
        </div>

        {/* Right Column - Patient Activity and Summaries */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-6 px-6">
                {[
                  { id: "overview", label: t("patientDetails.tabs.overview") },
                  {
                    id: "test-history",
                    label: t("patientDetails.tabs.testHistory"),
                  },
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
                <OverviewTab
                  patient={patient}
                  recentActivity={recentActivity}
                  summaryStats={summaryStats}
                />
              )}

              {activeTab === "test-history" && (
                <TestHistoryTab testOrders={patient.test_orders} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
