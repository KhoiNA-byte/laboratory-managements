// components/RolesPage/UpdateRoleModal.tsx
import React, { useState, useEffect } from "react";
import { PERMISSIONS } from "../../constants/permissions";

interface UpdateRoleModalProps {
  show: boolean;
  onClose: () => void;
  role: any;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  successMessage?: string | null;
}

// Group permissions by module for better organization
const groupPermissionsByModule = () => {
  const grouped: { [key: string]: { label: string; value: string }[] } = {};

  Object.entries(PERMISSIONS).forEach(([key, value]) => {
    const [module, action] = key.toLowerCase().split("_");
    if (!grouped[module]) {
      grouped[module] = [];
    }
    grouped[module].push({
      label: `${module.charAt(0).toUpperCase() + module.slice(1)} ${action}`,
      value: value,
    });
  });

  return grouped;
};

const UpdateRoleModal: React.FC<UpdateRoleModalProps> = ({
  show,
  onClose,
  role,
  formData,
  setFormData,
  handleSubmit,
  error,
  successMessage,
}) => {
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean;
  }>({});

  const groupedPermissions = groupPermissionsByModule();

  useEffect(() => {
    if (role) {
      setFormData({
        roleId: role.roleId,
        roleName: role.roleName,
        description: role.description,
        permission: role.permission || [],
        roleCode: role.roleCode,
        status: role.status || "active",
      });

      // Expand all modules by default when role data is loaded
      const initialExpanded: { [key: string]: boolean } = {};
      Object.keys(groupedPermissions).forEach((module) => {
        initialExpanded[module] = true;
      });
      setExpandedModules(initialExpanded);
    }
  }, [role, setFormData]);

  if (!show) return null;

  // Validation function
  const validateField = (name: string, value: string) => {
    const errors: { [key: string]: string } = { ...validationErrors };

    switch (name) {
      case "roleName":
        if (!value || value.trim().length < 2) {
          errors.roleName = "Role name must be at least 2 characters long";
        } else {
          delete errors.roleName;
        }
        break;

      case "roleCode":
        if (!value || value.trim().length < 2) {
          errors.roleCode = "Role code must be at least 2 characters long";
        } else if (!/^[a-z_]+$/.test(value)) {
          errors.roleCode =
            "Role code can only contain lowercase letters and underscores";
        } else {
          delete errors.roleCode;
        }
        break;

      case "description":
        if (!value || value.trim().length < 5) {
          errors.description = "Description must be at least 5 characters long";
        } else {
          delete errors.description;
        }
        break;
    }

    setValidationErrors(errors);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handlePermissionChange = (
    permissionValue: string,
    isChecked: boolean
  ) => {
    const currentPermissions = formData.permission || [];

    if (isChecked) {
      // Add permission if not already present
      if (!currentPermissions.includes(permissionValue)) {
        setFormData({
          ...formData,
          permission: [...currentPermissions, permissionValue],
        });
      }
    } else {
      // Remove permission
      setFormData({
        ...formData,
        permission: currentPermissions.filter(
          (p: string) => p !== permissionValue
        ),
      });
    }
  };

  const toggleModule = (module: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const selectAllInModule = (module: string) => {
    const modulePermissions = groupedPermissions[module].map((p) => p.value);
    const currentPermissions = new Set(formData.permission || []);

    modulePermissions.forEach((permission) => {
      currentPermissions.add(permission);
    });

    setFormData({
      ...formData,
      permission: Array.from(currentPermissions),
    });
  };

  const deselectAllInModule = (module: string) => {
    const modulePermissions = groupedPermissions[module].map((p) => p.value);
    const currentPermissions = (formData.permission || []).filter(
      (p: string) => !modulePermissions.includes(p)
    );

    setFormData({
      ...formData,
      permission: currentPermissions,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submit
    const fieldsToValidate = {
      roleName: formData.roleName,
      roleCode: formData.roleCode,
      description: formData.description,
    };

    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      validateField(field, value as string);
    });

    // Only submit if no validation errors
    if (Object.keys(validationErrors).length === 0) {
      handleSubmit(e);
    }
  };

  const isFormValid = () => {
    return (
      Object.keys(validationErrors).length === 0 &&
      formData.roleName &&
      formData.roleCode &&
      formData.description
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
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
          Update Role
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Modify the role's information and permissions
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              {/* Role Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role Name *
                </label>
                <input
                  type="text"
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.roleName
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  required
                />
                {validationErrors.roleName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.roleName}
                  </p>
                )}
              </div>

              {/* Role Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role Code *
                </label>
                <input
                  type="text"
                  name="roleCode"
                  value={formData.roleCode}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.roleCode
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  required
                />
                {validationErrors.roleCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.roleCode}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Use lowercase letters and underscores only
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.description
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  required
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.description}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
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
            </div>

            {/* Right Column - Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                {Object.entries(groupedPermissions).map(
                  ([module, permissions]) => (
                    <div
                      key={module}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {/* Module Header */}
                      <div
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleModule(module)}
                      >
                        <div className="flex items-center">
                          <svg
                            className={`h-4 w-4 mr-2 transform transition-transform ${
                              expandedModules[module] ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          <span className="font-medium text-gray-900 capitalize">
                            {module.replace("_", " ")}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {permissions.length}
                          </span>
                        </div>
                        <div
                          className="flex space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => selectAllInModule(module)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={() => deselectAllInModule(module)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>

                      {/* Permissions List */}
                      {expandedModules[module] && (
                        <div className="p-3 bg-white grid grid-cols-1 gap-2">
                          {permissions.map((permission) => (
                            <label
                              key={permission.value}
                              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={(formData.permission || []).includes(
                                  permission.value
                                )}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    permission.value,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700 flex-1">
                                {permission.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Selected Permissions Count */}
              <div className="mt-3 text-sm text-gray-600">
                {formData.permission?.length || 0} permissions selected
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div>
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
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md ${
                isFormValid()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoleModal;
