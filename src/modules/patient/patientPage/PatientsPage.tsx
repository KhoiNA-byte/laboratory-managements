import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Custom hooks
import { usePatientData } from "./hooks/usePatientData";
import { usePatientSearch } from "./hooks/usePatientSearch";
import { usePatientPagination } from "./hooks/usePatientPagination";
import { useDropdown } from "./hooks/useDropdown";

// Components
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { PatientHeader } from "./components/PatientHeader";
import { PatientSummaryCards } from "./components/PatientSummaryCards";
import { PatientSearchBar } from "./components/PatientSearchBar";
import { PatientTable } from "./components/PatientTable/PatientTable";
import { Pagination } from "./components/Pagination";

// Utils and constants
import { formatDate } from "./utils/dateFormatter";
import { PATIENTS_PER_PAGE } from "./constants/patient.constants";
import AddPatientModal from "../addPatient/AddPatientModal";

export const PatientsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const [showAddPatient, setShowAddPatient] = useState(false);

  // Custom hooks
  const { patients, loading, error, handleCreatePatient, handleDeletePatient } =
    usePatientData();

  const {
    searchTerm,
    setSearchTerm,
    handleSearch,
    handleKeyDown,
    clearSearch,
    filteredPatients,
    noResults,
  } = usePatientSearch(patients);

  const { currentPatients, currentPage, totalPages, nextPage, prevPage } =
    usePatientPagination(filteredPatients, PATIENTS_PER_PAGE);

  const { openDropdown, dropdownRef, toggleDropdown } = useDropdown();

  // Action handlers with useCallback for performance
  const handleViewDetails = useCallback(
    (mrn: string) => {
      navigate(`/admin/patients/${mrn}`);
    },
    [navigate]
  );

  const handleEditRecord = useCallback(
    (mrn: string) => {
      navigate(`/admin/patients/${mrn}/edit`);
    },
    [navigate]
  );

  const handleDeletePatientWithConfirm = useCallback(
    (mrn: string) => {
      const confirmed = window.confirm(
        t("patientsPage.table.confirmDelete", { mrn })
      );

      if (confirmed) {
        handleDeletePatient(mrn);
      }
    },
    [handleDeletePatient, t]
  );

  const handleAddPatient = useCallback(() => {
    setShowAddPatient(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddPatient(false);
  }, []);

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PatientHeader />

      {/* Summary Cards */}
      <PatientSummaryCards totalPatients={patients.length} />

      {/* All Patients Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="pt-[16px] px-[24px] pb-[16px] border-b border-gray-200">
          {/* <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("patientsPage.allPatients.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("patientsPage.allPatients.subtitle")}
              </p>
            </div>
          </div> */}

          {/* Search and Action Bar */}
          <PatientSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
            onClear={clearSearch}
            noResults={noResults}
            onAddPatient={handleAddPatient}
          />
        </div>

        {/* Patients Table */}
        <PatientTable
          patients={currentPatients}
          formatDate={formatDate}
          dropdownRef={dropdownRef}
          openDropdown={openDropdown}
          onToggleDropdown={toggleDropdown}
          onView={handleViewDetails}
          onEdit={handleEditRecord}
          onDelete={handleDeletePatientWithConfirm}
        />
      </div>

      {/* Pagination */}
      {filteredPatients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={prevPage}
          onNext={nextPage}
        />
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatient}
        onClose={handleCloseModal}
        onCreate={handleCreatePatient}
      />
    </div>
  );
};
