import { useState, useMemo } from "react";
import { Patient } from "../../../../services/patientApi";

/**
 * Custom hook for managing patient pagination
 */
export const usePatientPagination = (
  filteredPatients: Patient[],
  patientsPerPage: number
) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages (memoized)
  const totalPages = useMemo(
    () => Math.ceil(filteredPatients.length / patientsPerPage),
    [filteredPatients.length, patientsPerPage]
  );

  // Calculate start index (memoized)
  const startIndex = useMemo(
    () => (currentPage - 1) * patientsPerPage,
    [currentPage, patientsPerPage]
  );

  // Get current page patients (memoized)
  const currentPatients = useMemo(
    () => filteredPatients.slice(startIndex, startIndex + patientsPerPage),
    [filteredPatients, startIndex, patientsPerPage]
  );

  // Go to specific page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Go to next page
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Go to previous page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    currentPatients,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
};
