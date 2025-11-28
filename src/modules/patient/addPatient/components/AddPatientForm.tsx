import React from "react";
import { useTranslation } from "react-i18next";
import { AddPatientFormData } from "../types";

interface AddPatientFormProps {
  formData: AddPatientFormData;
  touched: Record<string, boolean>;
  errors: {
    name: boolean | undefined;
    dob: boolean | undefined;
    phone: boolean | undefined;
    email: boolean | undefined;
    address: boolean | undefined;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({
  formData,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  onClose,
}) => {
  const { t } = useTranslation("common");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("modals.addPatient.fullName")} *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("modals.addPatient.placeholders.fullName")}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                t("modals.addPatient.validation.nameRequired")
              )
            }
            onInput={(e) =>
              (e.target as HTMLInputElement).setCustomValidity("")
            }
          />
          {errors.name && (
            <p className="mt-1 text-red-600 text-sm">
              {t("modals.addPatient.validation.nameRequired")}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("modals.addPatient.dateOfBirth")} *
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                t("modals.addPatient.validation.dobRequired")
              )
            }
            onInput={(e) =>
              (e.target as HTMLInputElement).setCustomValidity("")
            }
          />
          {errors.dob && (
            <p className="mt-1 text-red-600 text-sm">
              {t("modals.addPatient.validation.dobInvalid")}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("modals.addPatient.gender")} *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option>{t("modals.addPatient.genderOptions.male")}</option>
            <option>{t("modals.addPatient.genderOptions.female")}</option>
            <option>{t("modals.addPatient.genderOptions.other")}</option>
          </select>
        </div>

        {/* Phone */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("modals.addPatient.phoneNumber")} *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              const errorMsg = t("modals.addPatient.validation.phoneRequired");

              if (!value) {
                e.target.setCustomValidity(errorMsg);
              } else if (!/^0\d{9}$/.test(value)) {
                e.target.setCustomValidity(errorMsg);
              } else {
                e.target.setCustomValidity("");
              }

              handleChange(e);
            }}
            onBlur={handleBlur}
            placeholder={t("modals.addPatient.placeholders.phoneNumber")}
            required
            pattern="0\d{9}"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                t("modals.addPatient.validation.phoneRequired")
              )
            }
            onInput={(e) =>
              (e.target as HTMLInputElement).setCustomValidity("")
            }
          />

          {/* Red error text hiển thị khi invalid */}
          {formData.phone !== "" && !/^0\d{9}$/.test(formData.phone) && (
            <p className="absolute right-0 mt-1 text-red-600 text-sm">
              {t("modals.addPatient.validation.phoneRequired")}
            </p>
          )}
          {touched.phone && errors.phone && (
            <p className="mt-1 text-red-600 text-sm">
              {t("modals.addPatient.validation.phoneRequired")}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("modals.addPatient.email")}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("modals.addPatient.placeholders.email")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-red-600 text-sm">
              {t("modals.addPatient.validation.emailInvalid")}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("modals.addPatient.address")} *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("modals.addPatient.placeholders.address")}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                t("modals.addPatient.validation.addressRequired")
              )
            }
            onInput={(e) =>
              (e.target as HTMLInputElement).setCustomValidity("")
            }
          />
          {errors.address && (
            <p className="mt-1 text-red-600 text-sm">
              {t("modals.addPatient.validation.addressRequired")}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {t("modals.addPatient.createPatient")}
        </button>
      </div>
    </form>
  );
};
