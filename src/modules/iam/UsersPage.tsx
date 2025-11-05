import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import Uheader from "../../components/UsersPage/UHeader";
import SummaryCard from "../../components/UsersPage/SummaryCard";
import BHeader from "../../components/UsersPage/BHeader";
import UsersFilters from "../../components/UsersPage/UsersFilters";
import CreateUserModal from "../../components/UsersPage/CreateUserModal";
import ViewDetailsModal from "../../components/UsersPage/ViewDetailsModal";
import UpdateUserModal from "../../components/UsersPage/UpdateUserModal";
import {
  clearMessages,
  clearCreateSuccess,
  clearUpdateSuccess,
} from "../../store/slices/userSlice";

export const UsersPage = () => {
  const {
    users,
    loading,
    error,
    successMessage,
    createSuccess,
    updateSuccess,
  } = useSelector((state: RootState) => state.users);

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All Genders");
  const [ageFilter, setAgeFilter] = useState("All Ages");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    role: "admin",
    age: 0,
    address: "",
    password: "",
    status: "active",
  });

  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    userId: "",
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    role: "admin",
    age: 0,
    address: "",
    status: "active",
  });

  // Filter and search functionality
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        genderFilter === "All Genders" || user.gender === genderFilter;

      // Fix role filter - map "Administrator" filter to "admin" in data
      const matchesRole = (() => {
        if (roleFilter === "All Roles") return true;

        // Map UI role names to database role names
        const roleMapping: { [key: string]: string } = {
          Administrator: "admin",
          "Lab Manager": "lab_manager",
          "Lab User": "lab_user",
          "Service User": "service_user",
          "Normal User": "normal_user",
        };

        const dbRole = roleMapping[roleFilter] || roleFilter;
        return user.role === dbRole;
      })();

      const matchesAge = (() => {
        if (ageFilter === "All Ages") return true;

        const age = user.age;
        switch (ageFilter) {
          case "Under 18":
            return age < 18;
          case "18-25":
            return age >= 18 && age <= 25;
          case "26-35":
            return age >= 26 && age <= 35;
          case "36-45":
            return age >= 36 && age <= 45;
          case "46-55":
            return age >= 46 && age <= 55;
          case "Over 55":
            return age > 55;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesGender && matchesRole && matchesAge;
    });
  }, [users, searchTerm, genderFilter, roleFilter, ageFilter]);

  // Function to display role names
  const getDisplayRole = (role: string) => {
    const roleDisplayMap: { [key: string]: string } = {
      admin: "Administrator",
      lab_manager: "Lab Manager",
      lab_user: "Lab User",
      service_user: "Service User",
      normal_user: "Normal User",
    };
    return roleDisplayMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    // Use the display role for styling
    const displayRole = getDisplayRole(role);
    switch (displayRole) {
      case "Administrator":
        return "bg-green-100 text-green-800";
      case "Lab Manager":
        return "bg-teal-100 text-teal-800";
      case "Lab User":
        return "bg-green-100 text-green-600";
      case "Service User":
        return "bg-blue-100 text-blue-600";
      case "Normal User":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "users/createUserRequest", payload: formData });
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "users/updateUserRequest", payload: updateFormData });
  };

  const handleViewDetails = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setOpenDropdown(null);
      setShowViewModal(true);
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setUpdateFormData({
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        age: user.age,
        address: user.address || "",
        status: user.status || "active",
      });
      setOpenDropdown(null);
      setShowUpdateModal(true);
    }
  };

  const handleToggleStatus = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const newStatus = user.status === "active" ? "inactive" : "active";

      const confirmed = window.confirm(
        `Are you sure you want to ${
          user.status === "active" ? "deactivate" : "activate"
        } user ${user.name}?`
      );

      if (confirmed) {
        dispatch({
          type: "users/updateUserRequest",
          payload: {
            ...user,
            status: newStatus,
          },
        });
      }
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
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
    dispatch({ type: "users/getUsersRequest" });
  }, [dispatch]);

  // Handle create success - auto close modal after success
  useEffect(() => {
    if (createSuccess && showCreateModal) {
      const timer = setTimeout(() => {
        setShowCreateModal(false);
        setFormData({
          id: "",
          name: "",
          email: "",
          phone: "",
          gender: "Male",
          role: "Administrator",
          age: 0,
          address: "",
          password: "",
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
        setSelectedUser(null);
        dispatch(clearUpdateSuccess());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, showUpdateModal, dispatch]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Uheader />
      <SummaryCard
        totalUsers={filteredUsers.length}
        newThisMonth={12}
        growthPercentage={8}
      />

      {/* All Users Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <BHeader />
          <UsersFilters
            genderFilter={genderFilter}
            ageFilter={ageFilter}
            roleFilter={roleFilter}
            searchTerm={searchTerm}
            setGenderFilter={setGenderFilter}
            setAgeFilter={setAgeFilter}
            setRoleFilter={setRoleFilter}
            setSearchTerm={setSearchTerm}
            onNewUser={() => {
              dispatch(clearMessages());
              setShowCreateModal(true);
            }}
          />
        </div>

        {/* Users Table */}
        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  User Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  Age/Gender
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center sm:px-6">
                    <div className="text-gray-500 text-sm">
                      {users.length === 0
                        ? "No users found"
                        : "No users match your filters"}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      Try adjusting your search or filters
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm text-gray-900">
                        {user.age} years / {user.gender}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm text-gray-900">
                        <div className="truncate max-w-[120px] sm:max-w-none">
                          {user.phone}
                        </div>
                        <div className="text-gray-500 truncate max-w-[120px] sm:max-w-none">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getDisplayRole(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          user.status || "active"
                        )}`}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium relative sm:px-6">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown(user.id)}
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

                        {openDropdown === user.id && (
                          <div
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                            ref={dropdownRef}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(user.id)}
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                View Profile
                              </button>

                              <button
                                onClick={() => handleEditUser(user.id)}
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
                                Edit User
                              </button>

                              <button
                                onClick={() => handleToggleStatus(user.id)}
                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                  user.status === "active"
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
                                  {user.status === "active" ? (
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
                                {user.status === "active"
                                  ? "Deactivate User"
                                  : "Activate User"}
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
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setFormData({
            id: "",
            name: "",
            email: "",
            phone: "",
            gender: "Male",
            role: "Administrator",
            age: 0,
            address: "",
            password: "",
            status: "active",
          });
          dispatch(clearMessages());
        }}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        error={error}
        successMessage={createSuccess ? successMessage : null}
      />

      {/* View Details Modal */}
      <ViewDetailsModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Update User Modal */}
      <UpdateUserModal
        show={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedUser(null);
          dispatch(clearMessages());
        }}
        user={selectedUser}
        formData={updateFormData}
        setFormData={setUpdateFormData}
        handleSubmit={handleUpdateSubmit}
        error={error}
        successMessage={updateSuccess ? successMessage : null}
      />
    </div>
  );
};
