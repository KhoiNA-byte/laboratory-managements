import React from "react";
import { useTranslation } from "react-i18next";
import { PatientFormData, ValidationErrors } from "../types";

interface EditPatientFormProps {
  formData: PatientFormData;
  validationErrors: ValidationErrors;
  updateLoading: boolean;
  updateError: string | null;
  successMessage: string | null;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isValid: boolean;
}

export const EditPatientForm: React.FC<EditPatientFormProps> = ({
  formData,
  validationErrors,
  updateLoading,
  updateError,
  successMessage,
  onInputChange,
  onSubmit,
  onCancel,
  isValid,
}) => {
  const { t } = useTranslation("common");

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("editPatientPage.personalDetails")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("patientsPage.table.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("editPatientPage.email")} ({t("editPatientPage.optional")})
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("patientsPage.table.phone")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.phone}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("editPatientPage.age")}
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.age && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.age}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("editPatientPage.gender")}
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                {t("editPatientPage.selectGender")}
              </option>
              <option value="Male">{t("usersPage.filters.male")}</option>
              <option value="Female">{t("usersPage.filters.female")}</option>
              <option value="Other">{t("editPatientPage.other")}</option>
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("editPatientPage.address")}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {validationErrors.address && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
        {/* Messages Section */}
        <div className="flex-grow">
          {updateError && (
            <div className="text-red-600 text-sm">{updateError}</div>
          )}
          {successMessage && (
            <div className="text-green-600 text-sm">{successMessage}</div>
          )}
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={updateLoading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={!isValid || updateLoading}
          className={`px-6 py-2 rounded-lg text-white transition-colors ${
            !isValid || updateLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {updateLoading
            ? t("common.saving")
            : t("editPatientPage.saveChanges")}
        </button>
      </div>
    </form>
  );
};
