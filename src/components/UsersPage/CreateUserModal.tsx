import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";

interface CreateUserModalProps {
  show: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  successMessage?: string | null;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  show,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  error,
  successMessage,
}) => {
  const { t } = useTranslation("common");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Get roles from Redux store
  const { roles } = useSelector((state: RootState) => state.roles);

  // Get active roles only and sort them
  const activeRoles = roles
    .filter((role) => role.status === "active")
    .sort((a, b) => a.roleName.localeCompare(b.roleName));

  // Function to get display name for role
  const getDisplayRoleName = (roleCode: string) => {
    const role = roles.find((r) => r.roleCode === roleCode);
    return role ? role.roleName : roleCode;
  };

  useEffect(() => {
    // Set default role if none is selected and there are active roles
    if (activeRoles.length > 0 && !formData.role) {
      setFormData({
        ...formData,
        role: activeRoles[0].roleCode,
      });
    }
  }, [activeRoles, formData.role]);

  if (!show) return null;

  // Validation function
  const validateField = (name: string, value: string | number) => {
    const errors: { [key: string]: string } = { ...validationErrors };

    switch (name) {
      case "name":
        if (!value || value.toString().trim().length < 2) {
          errors.name = t("modals.createUser.validation.nameRequired");
        } else {
          delete errors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value.toString())) {
          errors.email = t("modals.createUser.validation.emailRequired");
        } else {
          delete errors.email;
        }
        break;

      case "phone":
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!value || !phoneRegex.test(value.toString().replace(/\s/g, ""))) {
          errors.phone = t("modals.createUser.validation.phoneRequired");
        } else {
          delete errors.phone;
        }
        break;

      case "id":
        if (!value || value.toString().trim().length < 1) {
          errors.id = t("modals.createUser.validation.idRequired");
        } else {
          delete errors.id;
        }
        break;

      case "age":
        const ageNum = Number(value);
        if (!value || ageNum < 1 || ageNum > 120) {
          errors.age = t("modals.createUser.validation.ageRequired");
        } else {
          delete errors.age;
        }
        break;

      case "address":
        if (!value || value.toString().trim().length < 5) {
          errors.address = t("modals.createUser.validation.addressRequired");
        } else {
          delete errors.address;
        }
        break;

      case "password":
        if (!value || value.toString().length < 6) {
          errors.password = t("modals.createUser.validation.passwordRequired");
        } else {
          delete errors.password;
        }
        break;
    }

    setValidationErrors(errors);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submit
    const fieldsToValidate = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      id: formData.id,
      age: formData.age,
      address: formData.address,
      password: formData.password,
    };

    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      validateField(field, value);
    });

    // Only submit if no validation errors
    if (Object.keys(validationErrors).length === 0) {
      handleSubmit(e);
    }
  };

  const isFormValid = () => {
    return (
      Object.keys(validationErrors).length === 0 &&
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.id &&
      formData.age &&
      formData.address &&
      formData.password &&
      formData.role
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t("modals.createUser.title")}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {t("modals.createUser.subtitle")}
        </p>

        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.fullName")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.name ? "border-red-300" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.email ? "border-red-300" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.phoneNumber")} *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.phone ? "border-red-300" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.phone}
              </p>
            )}
          </div>

          {/* Identity Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.identityNumber")} *
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.id ? "border-red-300" : "border-gray-300"
              }`}
            />
            {validationErrors.id && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.id}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.gender")} *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">{t("modals.createUser.genderOptions.male")}</option>
              <option value="female">{t("modals.createUser.genderOptions.female")}</option>
              <option value="other">{t("modals.createUser.genderOptions.other")}</option>
              <option value="prefer_not_to_say">{t("modals.createUser.genderOptions.preferNotToSay")}</option>
            </select>
          </div>

          {/* Role - Now Dynamic */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.role")} *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">{t("modals.createUser.selectRole")}</option>
              {activeRoles.map((role) => (
                <option key={role.roleCode} value={role.roleCode}>
                  {role.roleName}
                </option>
              ))}
            </select>
            {activeRoles.length === 0 && (
              <p className="mt-1 text-xs text-red-500">
                {t("modals.createUser.noActiveRoles")}
              </p>
            )}
            {activeRoles.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {t("modals.createUser.activeRolesAvailable", { count: activeRoles.length })}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.age")} *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="1"
              max="120"
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.age ? "border-red-300" : "border-gray-300"
              }`}
            />
            {validationErrors.age && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.age}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.address")} *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.address ? "border-red-300" : "border-gray-300"
              }`}
            />
            {validationErrors.address && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.address}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("modals.createUser.password")} *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                validationErrors.password ? "border-red-300" : "border-gray-300"
              }`}
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Messages Section */}
          <div className="sm:col-span-2">
            {/* Error Message */}
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md text-sm mb-3">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="text-green-600 bg-green-50 border border-green-200 p-3 rounded-md text-sm">
                {successMessage}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-6 gap-3 sm:col-span-2">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-4 py-2 rounded-lg text-white ${
                isFormValid()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {t("modals.createUser.createUser")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
