import React from "react";
import { useTranslation } from "react-i18next";

interface PatientSummaryCardsProps {
  totalPatients: number;
}

/**
 * Patient summary cards component
 */
export const PatientSummaryCards: React.FC<PatientSummaryCardsProps> = ({
  totalPatients,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-0">
      {/* Total Patients Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {t("patientsPage.summaryCards.totalPatients")}
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t("patientsPage.summaryCards.activeRecords")}
            </p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* New This Month Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {t("patientsPage.summaryCards.newThisMonth")}
            </p>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-sm text-green-600 mt-1">
              {t("patientsPage.summaryCards.growthFromLastMonth", {
                percentage: 8,
              })}
            </p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Pending Tests Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {t("patientsPage.summaryCards.pendingTests")}
            </p>
            <p className="text-3xl font-bold text-gray-900">47</p>
            <p className="text-sm text-orange-600 mt-1">
              {t("patientsPage.summaryCards.awaitingResults")}
            </p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
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

      {/* Completed Today Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {t("patientsPage.summaryCards.completedToday")}
            </p>
            <p className="text-3xl font-bold text-gray-900">23</p>
            <p className="text-sm text-blue-600 mt-1">
              {t("patientsPage.summaryCards.testResults")}
            </p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
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
  );
};
