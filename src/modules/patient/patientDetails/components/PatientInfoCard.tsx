import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PatientInfoCardProps } from "../types";
import { getIcon } from "../utils";

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patient,
}) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">
            {patient.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{patient.name}</h2>
        <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {patient.id}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          {getIcon("person")}
          <span className="ml-3 text-gray-700 text-sm">
            {patient.age} {t("patientDetails.age")} /{" "}
            {t(`patientDetails.genderOptions.${patient.gender}`)}
          </span>
        </div>
        <div className="flex items-center">
          {getIcon("phone")}
          <span className="ml-3 text-gray-700 text-sm">{patient.phone}</span>
        </div>
        <div className="flex items-center">
          {getIcon("email")}
          <span className="ml-3 text-gray-700 text-sm">
            {patient.email && patient.email.trim() ? patient.email : "--"}
          </span>
        </div>
        <div className="flex items-center">
          {getIcon("location")}
          <span className="ml-3 text-gray-700 text-sm">{patient.address}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/admin/patients/${patient.id}/edit`)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {t("patientDetails.editPatient")}
      </button>
    </div>
  );
};
