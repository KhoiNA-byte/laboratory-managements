// @/pages/EditPatientPage.tsx

import React, { useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Hooks
import { useEditPatientForm } from "./hooks/useEditPatientForm";
import { useEditPatientData } from "./hooks/useEditPatientData";

// Components
import { EditPatientHeader } from "./components/EditPatientHeader";
import { EditPatientForm } from "./components/EditPatientForm";

export const EditPatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  // Form State Management
  const {
    formData,
    setFormData,
    validationErrors,
    handleInputChange,
    isFormValid,
    validateAll,
  } = useEditPatientForm(t);

  // Data Management
  const {
    pageLoading,
    pageError,
    updateLoading,
    updateError,
    successMessage,
    handleUpdatePatient,
  } = useEditPatientData(id, t, setFormData);

  // Handle Submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const isValid = validateAll();
      if (!isValid) {
        return;
      }

      handleUpdatePatient(formData);
    },
    [formData, validateAll, handleUpdatePatient]
  );

  // Handle Cancel
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Loading State
  if (pageLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t("editPatientPage.loadingData")}</p>
      </div>
    );
  }

  // Error State
  if (pageError) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {t("common.error")}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{pageError}</p>
        <div className="mt-4">
          <Link
            to="/admin/patients"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {t("editPatientPage.backToPatients")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditPatientHeader id={id} patientName={formData.name} />

      <EditPatientForm
        formData={formData}
        validationErrors={validationErrors}
        updateLoading={updateLoading}
        updateError={updateError}
        successMessage={successMessage}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isValid={isFormValid()}
      />
    </div>
  );
};
