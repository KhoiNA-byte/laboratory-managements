import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestOrderFormData } from "../../types/testOrder";
import { addTestOrder } from "../../services/testOrderApi";

const NewTestOrderPage: React.FC = () => {
  const navigate = useNavigate();

  // Get today's date in MM/DD/YYYY format for date inputs
  const today = new Date();
  const todayFormatted = `${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${today
    .getDate()
    .toString()
    .padStart(2, "0")}/${today.getFullYear()}`;

  // Form state
  const [formData, setFormData] = useState<TestOrderFormData>({
    patientName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    status: "Pending",
    createDate: todayFormatted,
    tester: "",
    runDate: "",
    testType: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState({
    patientName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    tester: "",
    runDate: "",
    testType: "",
  });

  // Validation functions
  const validatePatientName = (name: string): string => {
    if (!name.trim()) return "Patient name is required";
    if (name.length > 25) return "Patient name must not exceed 25 characters";
    return "";
  };

  const validateAge = (age: string): string => {
    if (!age.trim()) return "Age is required";
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return "Age must be a number";
    if (ageNum < 0) return "Age cannot be negative";
    if (ageNum > 120) return "Age cannot be greater than 120";
    return "";
  };

  const validateGender = (gender: string): string => {
    if (!gender.trim()) return "Gender is required";
    return "";
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone.trim()) return "Phone number is required";
    if (!/^\d+$/.test(phone)) return "Phone number must contain only digits";
    if (phone.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
  };

  const validateTester = (tester: string): string => {
    if (!tester.trim()) return "Tester is required";
    return "";
  };

  const validateTestType = (testType: string): string => {
    if (!testType.trim()) return "Test type is required";
    return "";
  };

  const validateRunDate = (runDate: string): string => {
    if (!runDate) return "Run date is required";

    // Check MM/DD/YYYY format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(runDate)) return "Date must be in MM/DD/YYYY format";

    // Convert MM/DD/YYYY to Date for comparison
    const parseDate = (dateStr: string): Date => {
      const [month, day, year] = dateStr.split("/").map((num) => parseInt(num));
      return new Date(year, month - 1, day);
    };

    const runDateObj = parseDate(runDate);
    const createDateObj = parseDate(formData.createDate);

    if (runDateObj < createDateObj)
      return "Run date must be after or equal to create date";
    return "";
  };

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate the field
    let error = "";
    switch (field) {
      case "patientName":
        error = validatePatientName(value);
        break;
      case "age":
        error = validateAge(value);
        break;
      case "gender":
        error = validateGender(value);
        break;
      case "phoneNumber":
        error = validatePhoneNumber(value);
        break;
      case "tester":
        error = validateTester(value);
        break;
      case "testType":
        error = validateTestType(value);
        break;
      case "runDate":
        error = validateRunDate(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Handle age input to only allow numbers
  const handleAgeChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    handleInputChange("age", numericValue);
  };

  // Handle run date change from date picker
  const handleRunDateChange = (value: string) => {
    if (value) {
      // Convert YYYY-MM-DD to MM/DD/YYYY
      const [year, month, day] = value.split("-");
      const formattedDate = `${month}/${day}/${year}`;
      handleInputChange("runDate", formattedDate);
    } else {
      handleInputChange("runDate", "");
    }
  };

  // Handle manual input for run date with MM/DD/YYYY format
  const handleRunDateTextChange = (value: string) => {
    // Allow only numbers and slashes
    let formatted = value.replace(/[^\d]/g, "");

    if (formatted.length >= 2) {
      formatted = formatted.substring(0, 2) + "/" + formatted.substring(2);
    }
    if (formatted.length >= 5) {
      formatted = formatted.substring(0, 5) + "/" + formatted.substring(5, 9);
    }

    setFormData((prev) => ({ ...prev, runDate: formatted }));

    // Validate if complete
    if (formatted.length === 10) {
      const error = validateRunDate(formatted);
      setErrors((prev) => ({ ...prev, runDate: error }));
    } else if (formatted.length > 0) {
      setErrors((prev) => ({
        ...prev,
        runDate: "Please enter complete date in MM/DD/YYYY format",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        runDate: "Run date is required",
      }));
    }
  };

  // Convert MM/DD/YYYY back to YYYY-MM-DD for date input
  const getDateInputValue = (dateStr: string): string => {
    if (!dateStr) return "";
    const [month, day, year] = dateStr.split("/");
    if (month && day && year) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return "";
  };

  // Handle phone number input to only allow numbers
  const handlePhoneChange = (value: string) => {
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/[^0-9]/g, "").substring(0, 10);
    handleInputChange("phoneNumber", numericValue);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      !errors.patientName &&
      !errors.age &&
      !errors.gender &&
      !errors.phoneNumber &&
      !errors.tester &&
      !errors.testType &&
      !errors.runDate &&
      formData.patientName.trim() &&
      formData.age.trim() &&
      formData.gender.trim() &&
      formData.phoneNumber.trim() &&
      formData.tester.trim() &&
      formData.testType.trim() &&
      formData.runDate
    );
  };

  const handleSave = async () => {
    try {
      // Call API service to create test order
      const result = await addTestOrder(formData);

      if (result.success) {
        navigate("/admin/test-orders");
      } else {
        alert("Failed to create test order. Please try again.");
      }
    } catch (error) {
      console.error("Error saving test order:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/test-orders");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Test Order Information
            </h1>
            <p className="text-gray-600 mt-1">Add the test order details</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
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
                    onChange={(e) =>
                      handleInputChange("patientName", e.target.value)
                    }
                    placeholder="Enter patient name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.patientName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.patientName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.patientName}
                    </p>
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
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
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
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("testType", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                        errors.testType ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select test type</option>
                      <option value="Blood Glucose">Blood Glucose</option>
                      <option value="Lipid Panel">Lipid Panel</option>
                      <option value="Hemoglobin A1C">Hemoglobin A1C</option>
                      <option value="COVID-19 PCR">COVID-19 PCR</option>
                      <option value="Liver Function Test">
                        Liver Function Test
                      </option>
                      <option value="Complete Blood Count">
                        Complete Blood Count
                      </option>
                      <option value="Kidney Function Test">
                        Kidney Function Test
                      </option>
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.testType}
                    </p>
                  )}
                </div>

                {/* Create Date */}
                <div className="h-20">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Create Date
                  </label>
                  <input
                    type="text"
                    value={formData.createDate}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Create date is set automatically (MM/DD/YYYY)
                  </p>
                </div>

                {/* Tester */}
                <div className="h-20">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tester}
                    onChange={(e) =>
                      handleInputChange("tester", e.target.value)
                    }
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
                <div className="h-24">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Run Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* Display input showing MM/DD/YYYY */}
                    <input
                      type="text"
                      value={formData.runDate}
                      onChange={(e) => handleRunDateTextChange(e.target.value)}
                      onClick={() => {
                        const hiddenDateInput = document.getElementById(
                          "hidden-date-picker"
                        ) as HTMLInputElement;
                        hiddenDateInput?.focus();
                        hiddenDateInput?.click();
                      }}
                      placeholder="MM/DD/YYYY"
                      maxLength={10}
                      className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
                        errors.runDate ? "border-red-500" : "border-gray-300"
                      }`}
                      readOnly={false}
                    />
                    {/* Calendar icon */}
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    {/* Hidden date input for calendar picker */}
                    <input
                      id="hidden-date-picker"
                      type="date"
                      value={getDateInputValue(formData.runDate)}
                      onChange={(e) => handleRunDateChange(e.target.value)}
                      min={getDateInputValue(formData.createDate)}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ zIndex: 1 }}
                    />
                  </div>
                  {errors.runDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.runDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid()}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isFormValid()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTestOrderPage;
