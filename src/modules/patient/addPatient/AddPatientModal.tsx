import React from "react";
import { useTranslation } from "react-i18next";
import { AddPatientModalProps } from "./types";
import { useAddPatientForm } from "./hooks/useAddPatientForm";
import { AddPatientForm } from "./components/AddPatientForm";

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation("common");
  const { formData, touched, errors, handleChange, handleBlur, handleSubmit } =
    useAddPatientForm(t, onCreate, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 relative">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("modals.addPatient.title")}
        </h2>
        <p className="text-gray-500 mb-6">{t("modals.addPatient.subtitle")}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Form */}
        <AddPatientForm
          formData={formData}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default AddPatientModal;
