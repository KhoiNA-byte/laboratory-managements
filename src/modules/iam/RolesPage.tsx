// modules/iam/RolesPage.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import {
  clearMessages,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
} from "../../store/slices/roleSlice";
import CreateRoleModal from "../../components/RolesPage/CreateRoleModal";
import UpdateRoleModal from "../../components/RolesPage/UpdateRoleModal";
import RolesHeader from "../../components/RolesPage/RolesHeader";

export const RolesPage = () => {
  const { t } = useTranslation("common");
  const {
    roles,
    loading,
    error,
    successMessage,
    createSuccess,
    updateSuccess,
    deleteSuccess,
  } = useSelector((state: RootState) => state.roles);

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permission: [] as string[],
    roleCode: "",
    status: "active",
  });

  const [updateFormData, setUpdateFormData] = useState({
    roleId: "",
    roleName: "",
    description: "",
    permission: [] as string[],
    roleCode: "",
    status: "active",
  });

  // Filter and search functionality
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        searchTerm === "" ||
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.roleCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || role.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [roles, searchTerm, statusFilter]);

  // Function to display role names properly
  const getDisplayRoleName = (roleCode: string) => {
    const roleDisplayMap: { [key: string]: string } = {
      admin: "Administrator",
      lab_manager: "Lab Manager",
      lab_user: "Lab User",
      service: "Service User",
      user: "Normal User",
    };
    return roleDisplayMap[roleCode] || roleCode;
  };

  const getRoleBadgeColor = (roleCode: string) => {
    switch (roleCode) {
      case "admin":
        return "bg-green-100 text-green-800";
      case "lab_manager":
        return "bg-teal-100 text-teal-800";
      case "lab_user":
        return "bg-blue-100 text-blue-600";
      case "service":
        return "bg-purple-100 text-purple-600";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "roles/createRoleRequest", payload: formData });
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "roles/updateRoleRequest", payload: updateFormData });
  };

  const handleEditRole = (roleCode: string) => {
    const role = roles.find((r) => r.roleCode === roleCode);
    if (role) {
      setSelectedRole(role);
      setOpenDropdown(null);
      setShowUpdateModal(true);
    }
  };

  const handleToggleStatus = (roleCode: string) => {
    const role = roles.find((r) => r.roleCode === roleCode);
    if (role) {
      const newStatus = role.status === "active" ? "inactive" : "active";

      const confirmed = window.confirm(
        role.status === "active"
          ? t("rolesPage.confirm.deactivateRole", { name: role.roleName })
          : t("rolesPage.confirm.activateRole", { name: role.roleName })
      );

      if (confirmed) {
        dispatch({
          type: "roles/updateRoleRequest",
          payload: {
            ...role,
            status: newStatus,
          },
        });
      }
    }
    setOpenDropdown(null);
  };

  const handleDeleteRole = (roleCode: string) => {
    const role = roles.find((r) => r.roleCode === roleCode);
    if (
      role &&
      window.confirm(t("rolesPage.confirm.deleteRole", { name: role.roleName }))
    ) {
      dispatch({ type: "roles/deleteRoleRequest", payload: roleCode });
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (roleCode: string) => {
    setOpenDropdown(openDropdown === roleCode ? null : roleCode);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch({ type: "roles/getRolesRequest" });
  }, [dispatch]);

  // Handle create success - auto close modal after success
  useEffect(() => {
    if (createSuccess && showCreateModal) {
      const timer = setTimeout(() => {
        setShowCreateModal(false);
        setFormData({
          roleName: "",
          description: "",
          permission: [],
          roleCode: "",
          status: "active",
        });
        dispatch(clearCreateSuccess());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [createSuccess, showCreateModal, dispatch]);

  // Handle update success - auto close modal after success
  useEffect(() => {
    if (updateSuccess && showUpdateModal) {
      const timer = setTimeout(() => {
        setShowUpdateModal(false);
        setSelectedRole(null);
        dispatch(clearUpdateSuccess());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, showUpdateModal, dispatch]);

  if (loading && roles.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">{t("rolesPage.table.loading")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-800 text-sm">{successMessage}</span>
            </div>
            <button
              onClick={() => dispatch(clearMessages())}
              className="text-green-400 hover:text-green-600"
            >
              <svg
                className="h-4 w-4"
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
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
            <button
              onClick={() => dispatch(clearMessages())}
              className="text-red-400 hover:text-red-600"
            >
              <svg
                className="h-4 w-4"
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
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("rolesPage.title")}
        </h1>
        <p className="text-gray-600">{t("rolesPage.subtitle")}</p>
      </div>

      {/* All Roles Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header Component */}
        <RolesHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearMessages={() => dispatch(clearMessages())}
          onShowCreateModal={() => setShowCreateModal(true)}
        />

        {/* Roles Table - Users column removed */}
        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  {t("rolesPage.table.roleName")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  {t("rolesPage.table.roleCode")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  {t("rolesPage.table.description")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  {t("rolesPage.table.status")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  {t("rolesPage.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center sm:px-6">
                    <div className="text-gray-500 text-sm">
                      {t("rolesPage.table.noRolesFound")}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.roleCode} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayRoleName(role.roleCode)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm text-gray-900">
                        {role.roleCode}
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {role.description}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          role.status || "active"
                        )}`}
                      >
                        {role.status === "active" ? t("common.active") : t("common.inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium relative sm:px-6">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown(role.roleCode)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openDropdown === role.roleCode && (
                          <div
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                            ref={dropdownRef}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleEditRole(role.roleCode)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <svg
                                  className="h-4 w-4 mr-3 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                {t("rolesPage.table.editRole")}
                              </button>

                              <button
                                onClick={() =>
                                  handleToggleStatus(role.roleCode)
                                }
                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                  role.status === "active"
                                    ? "text-orange-600 hover:bg-orange-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                              >
                                <svg
                                  className="h-4 w-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  {role.status === "active" ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                  )}
                                </svg>
                                {role.status === "active"
                                  ? t("rolesPage.table.deactivateRole")
                                  : t("rolesPage.table.activateRole")}
                              </button>

                              <button
                                onClick={() => handleDeleteRole(role.roleCode)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <svg
                                  className="h-4 w-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                {t("rolesPage.table.deleteRole")}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 sm:px-6">
          <div className="text-sm text-gray-600">
            {t("rolesPage.table.showing", { count: filteredRoles.length, total: roles.length })}
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      <CreateRoleModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setFormData({
            roleName: "",
            description: "",
            permission: [],
            roleCode: "",
            status: "active",
          });
          dispatch(clearMessages());
        }}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleCreateSubmit}
        error={error}
        successMessage={createSuccess ? successMessage : null}
      />

      {/* Update Role Modal */}
      <UpdateRoleModal
        show={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedRole(null);
          dispatch(clearMessages());
        }}
        role={selectedRole}
        formData={updateFormData}
        setFormData={setUpdateFormData}
        handleSubmit={handleUpdateSubmit}
        error={error}
        successMessage={updateSuccess ? successMessage : null}
      />
    </div>
  );
};
