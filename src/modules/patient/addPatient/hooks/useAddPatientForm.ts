import { useState, useCallback } from "react";
import { TFunction } from "i18next";
import { AddPatientFormData } from "../types";

export const useAddPatientForm = (
  t: TFunction,
  onCreate: (patientData: any) => void,
  onClose: () => void
) => {
  const initialFormData: AddPatientFormData = {
    name: "",
    dob: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
  };

  const [formData, setFormData] = useState<AddPatientFormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const validateName = (value: string) => value.trim() === "";
  const validateDob = (value: string) => {
    if (!value) return true;
    const d = new Date(value);
    if (isNaN(d.getTime())) return true;
    if (d > new Date()) return true;
    return false;
  };
  const validatePhone = (value: string) => !/^0\d{9}$/.test(value);
  const validateEmail = (value: string) =>
    value !== "" && !/^\S+@\S+\.\S+$/.test(value);
  const validateAddress = (value: string) => value.trim() === "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateName(formData.name);
    const dobErr = validateDob(formData.dob);
    const phoneErr = validatePhone(formData.phone);
    const emailErr = validateEmail(formData.email);
    const addressErr = validateAddress(formData.address);

    if (nameErr || dobErr || phoneErr || emailErr || addressErr) {
      setTouched({
        name: true,
        dob: true,
        phone: true,
        email: true,
        address: true,
      });
      return;
    }

    const dobDate = new Date(formData.dob);
    const birthYear = isNaN(dobDate.getFullYear())
      ? new Date().getFullYear()
      : dobDate.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    const now = new Date().toISOString();

    const fullPatientData = {
      name: formData.name.trim(),
      email: formData.email || "",
      phone: formData.phone,
      gender: formData.gender,
      role: "normal_user",
      age: age,
      address: formData.address,
      status: "waiting",
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
      password: "AdminSecure2024!",
      userId: `${Math.floor(Math.random() * 1000)}`,
    };

    onCreate(fullPatientData);
    alert(t("modals.addPatient.success", { name: formData.name }));
    console.log("Patient created:", fullPatientData);

    onClose();
    setFormData(initialFormData);
    setTouched({});
  };

  const errors = {
    name: touched.name && validateName(formData.name),
    dob: touched.dob && validateDob(formData.dob),
    phone: touched.phone && validatePhone(formData.phone),
    email: touched.email && validateEmail(formData.email),
    address: touched.address && validateAddress(formData.address),
  };

  return {
    formData,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
