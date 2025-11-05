import React from "react";

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
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
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
          Create New User
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the required information to create a new user account
        </p>

        <form
          onSubmit={handleSubmit}
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
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
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Identity Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Identity Number *
            </label>
            <input
              type="text"
              name="identityNumber"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>Administrator</option>
              <option>Lab Manager</option>
              <option>Lab User</option>
              <option>Service User</option>
              <option>Normal User</option>
              <option>Technician</option>
            </select>
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
              onChange={(e) =>
                setFormData({ ...formData, age: Number(e.target.value) })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
