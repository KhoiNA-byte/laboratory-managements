import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  age: number;
  address: string;
  lastLogin: string;
  status?: string;
}

interface UpdateUserModalProps {
  show: boolean;
  onClose: () => void;
  user: User | null;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  successMessage?: string | null;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  show,
  onClose,
  user,
  formData,
  setFormData,
  handleSubmit,
  error,
  successMessage,
}) => {
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Get roles from Redux store
  const { roles } = useSelector((state: RootState) => state.roles);

  // Get active roles only and sort them
  const activeRoles = roles
    .filter((role) => role.status === "active")
    .sort((a, b) => a.roleName.localeCompare(b.roleName));

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        age: user.age,
        address: user.address,
        status: user.status || "active",
      });
    }
  }, [user, setFormData]);

  if (!show || !user) return null;

  // Validation function
  const validateField = (name: string, value: string | number) => {
    const errors: { [key: string]: string } = { ...validationErrors };

    switch (name) {
      case "name":
        if (!value || value.toString().trim().length < 2) {
          errors.name = "Name must be at least 2 characters long";
        } else {
          delete errors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value.toString())) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;

      case "phone":
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!value || !phoneRegex.test(value.toString().replace(/\s/g, ""))) {
          errors.phone = "Please enter a valid phone number";
        } else {
          delete errors.phone;
        }
        break;

      case "age":
        const ageNum = Number(value);
        if (!value || ageNum < 1 || ageNum > 120) {
          errors.age = "Age must be between 1 and 120";
        } else {
          delete errors.age;
        }
        break;

      case "address":
        if (value && value.toString().trim().length < 5) {
          errors.address = "Address must be at least 5 characters long";
        } else {
          delete errors.address;
        }
        break;
    }

    setValidationErrors(errors);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle number conversion for age
    const processedValue = name === "age" ? Number(value) : value;

    setFormData({ ...formData, [name]: processedValue });
    validateField(name, processedValue);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submit
    const fieldsToValidate = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      address: formData.address,
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
      formData.age &&
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
          Update User
        </h2>

        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
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
              Email *
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
              Phone Number *
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

          {/* Identity Number (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Identity Number
            </label>
            <input
              type="text"
              value={formData.id}
              readOnly
              className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Identity number cannot be changed
            </p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Role - Now Dynamic */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a role</option>
              {activeRoles.map((role) => (
                <option key={role.roleCode} value={role.roleCode}>
                  {role.roleName}
                </option>
              ))}
            </select>
            {activeRoles.length === 0 && (
              <p className="mt-1 text-xs text-red-500">
                No active roles available
              </p>
            )}
            {activeRoles.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {activeRoles.length} active role(s) available
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age *
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
              required
            />
            {validationErrors.age && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.age}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
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

          {/* Messages Section */}
          <div className="sm:col-span-2">
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md text-sm mb-3">
                {error}
              </div>
            )}

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
              Cancel
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
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
