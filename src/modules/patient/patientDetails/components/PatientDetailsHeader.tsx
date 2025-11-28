import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const PatientDetailsHeader: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {t("patientDetails.title")}
          </h1>
          <p className="text-gray-600 text-sm">
            {t("patientDetails.subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <Link
          to="/admin/patients"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {t("patientsPage.title")}
        </Link>
      </div>
    </div>
  );
};
