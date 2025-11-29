import React from "react";
import { useTranslation } from "react-i18next";
import { Patient } from "../../../../../services/patientApi";
import { PatientActionDropdown } from "./PatientActionDropdown";

interface PatientTableRowProps {
  patient: Patient;
  formatDate: (isoString: string) => string;
  openDropdown: string | null;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onToggleDropdown: (patientId: string) => void;
  onView: (mrn: string) => void;
  onEdit: (mrn: string) => void;
  onDelete: (mrn: string) => void;
}

/**
 * Patient table row component
 */
export const PatientTableRow: React.FC<PatientTableRowProps> = ({
  patient,
  formatDate,
  openDropdown,
  dropdownRef,
  onToggleDropdown,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation("common");

  return (
    <tr className="hover:bg-gray-50 relative">
      <td className="px-6 py-4 whitespace-nowrap w-[100px]">
        <div className="text-sm font-medium text-blue-600">
          {patient.userId}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-[180px]">
        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-[120px]">
        <div className="text-sm text-gray-900">
          {patient.age} {t("common.years")} /{" "}
          {patient.gender === "Male"
            ? t("usersPage.filters.male")
            : patient.gender === "Female"
            ? t("usersPage.filters.female")
            : patient.gender}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap w-[200px]">
        <div className="text-sm text-gray-900">
          <div>{patient.phone}</div>
          <div className="text-gray-500">
            {patient.email ? patient.email : "--"}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[150px]">
        {formatDate(patient.updatedAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium overflow-visible w-[140px]">
        <PatientActionDropdown
          patientId={patient.userId}
          isOpen={openDropdown === patient.userId}
          onToggle={onToggleDropdown}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          dropdownRef={dropdownRef}
        />
      </td>
    </tr>
  );
};
