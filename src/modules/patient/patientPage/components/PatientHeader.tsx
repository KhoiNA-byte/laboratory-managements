import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Patient page header component
 */
export const PatientHeader: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t("patientsPage.title")}
      </h1>
      <p className="text-gray-600">{t("patientsPage.subtitle")}</p>
    </div>
  );
};
