import React, { useState } from "react";

interface AddPatientProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (patientData: any) => void;
}

const AddPatientModal: React.FC<AddPatientProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🧮 Tính tuổi dựa vào năm sinh
    const birthYear = new Date(formData.dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // 🕒 Thời gian hiện tại ISO
    const now = new Date().toISOString();

    // 🧩 Dữ liệu hoàn chỉnh gửi lên API
    const fullPatientData = {
      name: formData.name.trim(),
      email: formData.email || "",
      phone: formData.phone,
      gender: formData.gender,
      role: "normal_user",
      age: age,
      address: formData.address,
      status: "waiting",
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
      password: "AdminSecure2024!",
      // Giả lập id & userId (thực tế backend hoặc mockAPI sẽ tự tạo)
      id: `id-${Date.now()}`,
      userId: `${Math.floor(Math.random() * 1000)}`,
    };

    // Gửi dữ liệu ra ngoài
    onCreate(fullPatientData);

    // Thông báo popup
    alert(`Patient ${formData.name} has been added successfully!`);
    console.log("Patient created:", fullPatientData);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 relative">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Patient Information
        </h2>
        <p className="text-gray-500 mb-6">
          Enter the patient's personal and contact details
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State, ZIP"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Create Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
