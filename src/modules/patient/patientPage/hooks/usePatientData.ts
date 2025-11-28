import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import {
  getPatientsRequest,
  createPatientRequest,
  deletePatientRequest,
} from "../../../../store/slices/patientSlice";
import { Patient } from "../../../../services/patientApi";

/**
 * Custom hook for managing patient data and CRUD operations
 */
export const usePatientData = () => {
  const dispatch = useDispatch();

  // Get patients from Redux store
  const { patients, loading, error, successMessage } = useSelector(
    (state: RootState) => state.patients
  );

  // Fetch patients when component mounts
  useEffect(() => {
    dispatch(getPatientsRequest());
  }, [dispatch]);

  // Refetch patients after create/update/delete operations
  useEffect(() => {
    if (successMessage) {
      // Only refetch after create/update/delete operations
      if (
        successMessage.includes("created") ||
        successMessage.includes("updated") ||
        successMessage.includes("deleted")
      ) {
        dispatch(getPatientsRequest());
      }
    }
  }, [successMessage, dispatch]);

  // Create patient handler
  const handleCreatePatient = (
    data: Omit<Patient, "id" | "createdAt" | "updatedAt">
  ) => {
    dispatch(createPatientRequest(data));
  };

  // Delete patient handler
  const handleDeletePatient = (mrn: string) => {
    dispatch(deletePatientRequest(mrn));
  };

  return {
    patients,
    loading,
    error,
    successMessage,
    handleCreatePatient,
    handleDeletePatient,
  };
};
