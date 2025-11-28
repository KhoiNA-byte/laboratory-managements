import React from "react";
import { useTranslation } from "react-i18next";
import { TestHistoryTabProps } from "../types";
import { formatDateTime, getStatusBadgeColor } from "../utils";

export const TestHistoryTab: React.FC<TestHistoryTabProps> = ({
  testOrders,
}) => {
  const { t } = useTranslation("common");

  if (!testOrders || testOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t("patientDetails.noTestHistoryTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("patientDetails.noTestHistoryDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              {t("patientDetails.table.headers.testType")}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t("patientDetails.table.headers.orderedAt")}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t("patientDetails.table.headers.status")}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t("patientDetails.table.headers.tester")}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t("patientDetails.table.headers.note")}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t("patientDetails.table.headers.testId")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {[...testOrders]
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
                  {formatDateTime(order.orderedAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    {t(`patientDetails.statusOptions.${order.status}`)}
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
            ))}
        </tbody>
      </table>
    </div>
  );
};
