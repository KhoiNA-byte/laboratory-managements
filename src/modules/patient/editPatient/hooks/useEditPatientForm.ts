import { useState, useCallback } from "react";
import { TFunction } from "i18next";
import { PatientFormData, ValidationErrors } from "../types";

export const useEditPatientForm = (t: TFunction) => {
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const getFieldError = useCallback(
    (name: string, value: string | number): string | undefined => {
      const stringValue = value.toString().trim();
      switch (name) {
        case "name": {
          const normalized = stringValue.normalize("NFC");
          if (!normalized) return t("editPatientPage.nameRequired");
          if (!/^[\p{L}\s'\-]+$/u.test(normalized))
            return t("editPatientPage.nameInvalid");
          return undefined;
        }
        case "email":
          if (stringValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue))
            return t("editPatientPage.emailInvalid");
          return undefined;
        case "phone":
          if (!stringValue) return t("editPatientPage.phoneRequired");
          if (!/^0\d{9}$/.test(stringValue))
            return t("editPatientPage.phoneInvalid");
          return undefined;
        case "age":
          if (!stringValue) return t("editPatientPage.ageRequired");
          if (isNaN(Number(stringValue)) || Number(stringValue) <= 0)
            return t("editPatientPage.ageInvalid");
          return undefined;
        case "address":
          if (!stringValue) return t("editPatientPage.addressRequired");
          return undefined;
        case "gender":
          if (!stringValue) return t("editPatientPage.genderRequired");
          return undefined;
        default:
          return undefined;
      }
    },
    [t]
  );

  const validateField = useCallback(
    (name: string, value: string | number) => {
      const error = getFieldError(name, value);
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    },
    [getFieldError]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      validateField(name, value);
    },
    [validateField]
  );

  const validateAll = useCallback(() => {
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = getFieldError(key, formData[key as keyof PatientFormData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, getFieldError]);

  const isFormValid = useCallback(() => {
    const hasValidationErrors = Object.keys(validationErrors).some(
      (key) => validationErrors[key]
    );
    if (hasValidationErrors) return false;

    const { name, phone, age, address, gender } = formData;
    return !!(
      name.trim() &&
      phone.trim() &&
      age.trim() &&
      address.trim() &&
      gender
    );
  }, [formData, validationErrors]);

  return {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    handleInputChange,
    isFormValid,
    validateAll,
  };
};
