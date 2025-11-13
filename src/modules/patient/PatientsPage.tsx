import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import AddPatientModal from "./AddPatientModal";

export const PatientsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get patients from Redux store
  const { patients, loading, error, successMessage } = useSelector(
    (state: RootState) => state.patients
  );

  // Add effect to fetch patients when component mounts
  useEffect(() => {
    console.log("Component mounted - Fetching patients");
    dispatch({ type: "patients/getPatientsRequest" });
  }, []); // Empty dependency array means this runs once on mount

  // Separate effect for handling success messages
  useEffect(() => {
    if (successMessage) {
      // Only refetch after create/update/delete operations
      if (
        successMessage.includes("created") ||
        successMessage.includes("updated") ||
        successMessage.includes("deleted")
      ) {
        dispatch({ type: "patients/getPatientsRequest" });
      }
    }
  }, [successMessage, dispatch]);

  // New create patient handler using Redux
  const handleCreatePatient = (data: any) => {
    dispatch({ type: "patients/createPatientRequest", payload: data });
  };

  // New delete handler using Redux
  const handleDeletePatient = (mrn: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete patient ${mrn}? This action cannot be undone.`
    );

    if (confirmed) {
      dispatch({ type: "patients/deletePatientRequest", payload: mrn });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);

  const handleViewDetails = (mrn: string) => {
    console.log("handleViewDetails called with MRN:", mrn);
    console.log("Navigating to:", `/admin/patients/${mrn}`);
    console.log("About to call navigate");
    // Close dropdown first, then navigate
    setOpenDropdown(null);
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      navigate(`/admin/patients/${mrn}`);
      console.log("Navigate called");
    }, 100);
  };

  const handleEditRecord = (mrn: string) => {
    setOpenDropdown(null);
    setTimeout(() => {
      navigate(`/admin/patients/${mrn}/edit`);
    }, 100);
  };

  // Paging
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5; // <<<<<<<<-------- Patients per page

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    // Add a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleSearch = () => {
    setQuery(searchTerm.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Lọc dựa trên query chứ không phải searchTerm
  const filteredPatients = patients.filter((patient) =>
    query === ""
      ? true
      : patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.userId.toLowerCase().includes(query.toLowerCase())
  );

  const noResults = filteredPatients.length === 0 && query !== "";

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const currentPatients = filteredPatients.slice(
    startIndex,
    startIndex + patientsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Add loading state handling
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Add error state handling
  if (error) {
    return <div className="text-center text-red-600 py-4">Error: {error}</div>;
  }

  // Format time
  const formatDate = (isoString: string) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString.slice(0, 10); // fallback nếu chuỗi không hợp lệ
    return date.toISOString().split("T")[0]; // ✅ YYYY-MM-DD
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Patient Records
        </h1>
        <p className="text-gray-600">
          Manage patient medical records and information
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-0">
        {/* Total Patients Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Patients
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {patients.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Active records</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* New This Month Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                New This Month
              </p>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Tests Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Pending Tests
              </p>
              <p className="text-3xl font-bold text-gray-900">47</p>
              <p className="text-sm text-orange-600 mt-1">Awaiting results</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Today Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Completed Today
              </p>
              <p className="text-3xl font-bold text-gray-900">23</p>
              <p className="text-sm text-blue-600 mt-1">Test results</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* All Patients Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="pt-[16px] px-[24px] pb-[16px] border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                All Patients
              </h3>
              <p className="text-sm text-gray-600">
                View and manage patient medical records
              </p>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              {/* Search Input */}
              <div className="flex items-center gap-2">
                <div className="relative max-w-md w-full">
                  <input
                    type="text"
                    placeholder="Search by name, email, or MRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />

                  {/* Search Icon */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Clear (X) Button */}
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setQuery("");
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Search
                </button>

                {/* No results message */}
                {noResults && (
                  <span className="ml-3 text-sm text-red-500 font-medium whitespace-nowrap">
                    No results found
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Add Patient Button */}
              <button
                onClick={() => setShowAddPatient(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Patient
              </button>

              {/* Overlay */}
              <AddPatientModal
                isOpen={showAddPatient}
                onClose={() => setShowAddPatient(false)}
                onCreate={handleCreatePatient}
              />
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                  MRN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 overflow-visible">
              {currentPatients.map((patient) => (
                <tr key={patient.userId} className="hover:bg-gray-50 relative">
                  <td className="px-6 py-4 whitespace-nowrap w-[100px]">
                    <div className="text-sm font-medium text-blue-600">
                      {patient.userId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-[180px]">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-[120px]">
                    <div className="text-sm text-gray-900">
                      {patient.age} years / {patient.gender}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-[200px]">
                    <div className="text-sm text-gray-900">
                      <div>{patient.phone}</div>
                      <div className="text-gray-500">
                        {patient.email ? patient.email : "--null--"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[150px]">
                    {formatDate(patient.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium overflow-visible w-[140px]">
                    <div
                      className="relative"
                      ref={dropdownRef}
                      style={{ overflow: "visible" }}
                    >
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(
                            "Dropdown button clicked for patient:",
                            patient.userId
                          );
                          console.log("Current openDropdown:", openDropdown);
                          setOpenDropdown(
                            openDropdown === patient.userId
                              ? null
                              : patient.userId
                          );
                        }}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {openDropdown === patient.userId && (
                        <div
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                          style={{ zIndex: 9999 }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(
                              "Dropdown container clicked - preventing close"
                            );
                          }}
                        >
                          <div className="py-1">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(
                                  "View Details button clicked for patient:",
                                  patient.userId
                                );
                                console.log("About to call handleViewDetails");
                                handleViewDetails(patient.userId);
                                console.log("handleViewDetails called");
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg
                                className="h-4 w-4 mr-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View Details
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEditRecord(patient.userId);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg
                                className="h-4 w-4 mr-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              Edit Record
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeletePatient(patient.userId);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <svg
                                className="h-4 w-4 mr-3 text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete Patient
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Nếu không tìm thấy kết quả */}
          {filteredPatients.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">
              No data
            </div>
          )}
        </div>
      </div>

      {/* Pagination - siêu sát bảng */}
      {filteredPatients.length > 0 && (
        <div className="flex justify-center items-center mt-0 mb-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
