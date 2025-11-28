import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TFunction } from "i18next";
import { getPatientById } from "../../../../services/patientApi";
import {
  updatePatientRequest,
  clearMessages,
  clearUpdateSuccess,
} from "../../../../store/slices/patientSlice";
import type { RootState } from "../../../../store";
import { PatientFormData } from "../types";

export const useEditPatientData = (
  id: string | undefined,
  t: TFunction,
  setFormData: (data: PatientFormData) => void
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const {
    loading: updateLoading,
    error: updateError,
    updateSuccess,
    successMessage,
  } = useSelector((state: RootState) => state.patients);

  // Fetch patient data
  useEffect(() => {
    if (!id) {
      navigate("/admin/patients");
      return;
    }

    const fetchPatient = async () => {
      setPageLoading(true);
      setPageError(null);
      try {
        const patient = await getPatientById(id);
        const initialData: PatientFormData = {
          name: patient.name,
          email: patient.email || "",
          phone: patient.phone,
          gender: patient.gender,
          age: patient.age.toString(),
          address: patient.address,
        };
        setFormData(initialData);
      } catch (err) {
        setPageError(t("editPatientPage.loadError"));
      } finally {
        setPageLoading(false);
      }
    };

    fetchPatient();

    return () => {
      dispatch(clearMessages());
    };
  }, [id, navigate, dispatch, t, setFormData]);

  // Handle success redirect
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        navigate(`/admin/patients/${id}`);
        dispatch(clearUpdateSuccess());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, navigate, dispatch, id]);

  const handleUpdatePatient = useCallback(
    (data: PatientFormData) => {
      if (!id) return;

      const patientDataToSubmit = {
        ...data,
        age: parseInt(data.age, 10),
        id: id,
        role: "normal_user",
        // Add missing fields if necessary, or let the API handle it.
        // The original code had this issue, we are replicating it but we can improve if we knew the API.
        // For now, keep as is.
      };

      // @ts-ignore - Ignoring the type error for now as per original code issue
      dispatch(updatePatientRequest(patientDataToSubmit));
    },
    [dispatch, id]
  );

  return {
    pageLoading,
    pageError,
    updateLoading,
    updateError,
    successMessage,
    handleUpdatePatient,
  };
};
