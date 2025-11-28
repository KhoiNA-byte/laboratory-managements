import React from "react";
import { useTranslation } from "react-i18next";
import { OverviewTabProps } from "../types";
import { getIcon, getStatusBadgeColor } from "../utils";

export const OverviewTab: React.FC<OverviewTabProps> = ({
  recentActivity,
  summaryStats,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {t("patientDetails.recentActivity")}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {t("patientDetails.latestTestOrders")}
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
                    {new Date(activity.orderedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    activity.status
                  )}`}
                >
                  {t(`patientDetails.statusOptions.${activity.status}`)}
                </span>
                <span className="text-sm text-gray-600">{activity.note}</span>
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
                {stat.icon ? getIcon(stat.icon) : null}
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
