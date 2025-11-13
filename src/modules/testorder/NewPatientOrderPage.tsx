import React from "react";
import { TestOrderFormData } from "../../types/testOrder";

interface NewPatientOrderPageProps {
  formData: TestOrderFormData;
  errors: {
    patientName: string;
    age: string;
    gender: string;
    phoneNumber: string;
    tester: string;
    runDate: string;
    testType: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleAgeChange: (value: string) => void;
  handlePhoneChange: (value: string) => void;
  handleRunDateChange: (value: string) => void;
  handleRunDateTextChange: (value: string) => void;
  getDateInputValue: (dateStr: string) => string;
}

export const NewPatientOrderPage: React.FC<NewPatientOrderPageProps> = ({
  formData,
  errors,
  handleInputChange,
  handleAgeChange,
  handlePhoneChange,
  handleRunDateChange,
  handleRunDateTextChange,
  getDateInputValue,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Patient Name */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.patientName}
            onChange={(e) => handleInputChange("patientName", e.target.value)}
            placeholder="Enter patient name"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.patientName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.patientName && (
            <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
          )}
        </div>

        {/* Age */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.age}
            onChange={(e) => handleAgeChange(e.target.value)}
            placeholder="Enter age (0-120)"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.age ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>

        {/* Gender */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Enter phone number (10 digits)"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Status */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Test Type */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.testType}
              onChange={(e) => handleInputChange("testType", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                errors.testType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select test type</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Urine Test">Urine Test</option>
              <option value="X-Ray">X-Ray</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
              <option value="Ultrasound">Ultrasound</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.testType && (
            <p className="text-red-500 text-sm mt-1">{errors.testType}</p>
          )}
        </div>

        {/* Tester */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tester <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.tester}
            onChange={(e) => handleInputChange("tester", e.target.value)}
            placeholder="Enter tester name"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tester ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.tester && (
            <p className="text-red-500 text-sm mt-1">{errors.tester}</p>
          )}
        </div>

        {/* Run Date */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Run Date <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={getDateInputValue(formData.runDate)}
              onChange={(e) => handleRunDateChange(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.runDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="text"
              value={formData.runDate}
              onChange={(e) => handleRunDateTextChange(e.target.value)}
              placeholder="MM/DD/YYYY"
              className={`w-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.runDate ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.runDate && (
            <p className="text-red-500 text-sm mt-1">{errors.runDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};
