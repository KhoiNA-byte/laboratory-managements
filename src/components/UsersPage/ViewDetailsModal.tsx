import React from "react";

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

interface ViewDetailsModalProps {
  show: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  show,
  onClose,
  user,
}) => {
  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
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
          User Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Personal Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Identity Number
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.age} years</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.gender}</p>
            </div>
          </div>

          {/* Contact & Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Contact & Account
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.role}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Login
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.lastLogin}</p>
            </div>
          </div>

          {/* Address (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {user.address || "No address provided"}
            </p>
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <span
              className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.status || "active"}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
