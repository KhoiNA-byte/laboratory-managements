import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PatientNotFoundProps {
  id: string | undefined;
}

export const PatientNotFound: React.FC<PatientNotFoundProps> = ({ id }) => {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-gray-500">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t("patientDetails.notFoundTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("patientDetails.notFoundDesc", { id })}
          </p>
          <div className="mt-4">
            <Link
              to="/admin/patients"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t("patientsPage.title")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
