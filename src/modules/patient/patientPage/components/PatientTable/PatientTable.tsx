import React from "react";
import { useTranslation } from "react-i18next";
import { Patient } from "../../../../../services/patientApi";
import { PatientTableRow } from "./PatientTableRow";

interface PatientTableProps {
  patients: Patient[];
  formatDate: (isoString: string) => string;
  dropdownRef: React.RefObject<HTMLDivElement>;
  openDropdown: string | null;
  onToggleDropdown: (patientId: string) => void;
  onView: (mrn: string) => void;
  onEdit: (mrn: string) => void;
  onDelete: (mrn: string) => void;
}

/**
 * Patient table component
 */
export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  formatDate,
  dropdownRef,
  openDropdown,
  onToggleDropdown,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
              {t("patientsPage.table.mrn")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">
              {t("patientsPage.table.name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
              {t("patientsPage.table.ageGender")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
              {t("patientsPage.table.contact")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
              {t("patientsPage.table.lastVisit")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
              {t("patientsPage.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 overflow-visible">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PatientTableRow
                key={patient.userId}
                patient={patient}
                formatDate={formatDate}
                openDropdown={openDropdown}
                dropdownRef={dropdownRef}
                onToggleDropdown={onToggleDropdown}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-6 text-gray-500 text-sm"
              >
                {t("patientsPage.table.noPatientsFound")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
