import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface EditPatientHeaderProps {
  id: string | undefined;
  patientName: string;
}

export const EditPatientHeader: React.FC<EditPatientHeaderProps> = ({
  id,
  patientName,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="mb-6">
      <nav className="text-sm" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2">
          <li className="flex items-center">
            <Link
              to="/admin/patients"
              className="text-gray-500 hover:text-blue-600"
            >
              {t("patientsPage.title")}
            </Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <Link
              to={`/admin/patients/${id}`}
              className="text-gray-500 hover:text-blue-600"
            >
              {patientName || t("editPatientPage.patientDetails")}
            </Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-700">{t("common.edit")}</span>
          </li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mt-2">
        {t("editPatientPage.title")}
      </h1>
    </div>
  );
};
