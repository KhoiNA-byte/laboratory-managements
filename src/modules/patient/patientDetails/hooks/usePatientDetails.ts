import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientById, Patient } from "../../../../services/patientApi";

export const usePatientDetails = (id: string | undefined) => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/admin/patients");
      return;
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPatientById(id);
        setPatient(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, navigate]);

  return { patient, loading, error };
};
