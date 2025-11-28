import { useState, useMemo } from "react";
import { Patient } from "../../../../services/patientApi";

/**
 * Custom hook for managing patient search functionality
 */
export const usePatientSearch = (patients: Patient[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  // Handle search button click
  const handleSearch = () => {
    setQuery(searchTerm.trim());
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setQuery("");
  };

  // Filter patients based on query (memoized for performance)
  const filteredPatients = useMemo(() => {
    if (query === "") {
      return patients;
    }
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.userId.toLowerCase().includes(query.toLowerCase())
    );
  }, [patients, query]);

  // Check if there are no results
  const noResults = filteredPatients.length === 0 && query !== "";

  return {
    searchTerm,
    setSearchTerm,
    query,
    handleSearch,
    handleKeyDown,
    clearSearch,
    filteredPatients,
    noResults,
  };
};
