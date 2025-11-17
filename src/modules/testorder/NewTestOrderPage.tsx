import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestOrderFormData } from "../../types/testOrder";
import {
  addTestOrder,
  getUserByPhoneNumber,
} from "../../services/testOrderApi";
import { ReturningPatientOrderPage } from "./ReturningPatientOrderPage";
import {
  validatePhoneNumber,
  validateTestType,
  validateRunDate,
} from "../../utils/validation";
import {
  formatPhoneInput,
  convertDatePickerToDisplay,
  formatDateInput,
  convertDisplayToDatePicker,
  getTodayFormatted,
} from "../../utils/helpers";

const NewTestOrderPage: React.FC = () => {
  const navigate = useNavigate();

  // Store found user ID from phone search
  const [foundUserId, setFoundUserId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<TestOrderFormData>({
    patientName: "-----",
    age: "-----",
    gender: "-----",
    phoneNumber: "",
    status: "Pending",
    createDate: getTodayFormatted(),
    note: "",
    runDate: "",
    testType: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState({
    patientName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    note: "",
    runDate: "",
    testType: "",
  });

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate the field
    let error = "";
    switch (field) {
      case "phoneNumber":
        error = validatePhoneNumber(value);
        break;
      case "testType":
        error = validateTestType(value);
        break;
      case "runDate":
        error = validateRunDate(value, formData.createDate);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Handle run date change from date picker
  const handleRunDateChange = (value: string) => {
    if (value) {
      const formattedDate = convertDatePickerToDisplay(value);
      handleInputChange("runDate", formattedDate);
    } else {
      handleInputChange("runDate", "");
    }
  };

  // Handle manual input for run date with MM/DD/YYYY format
  const handleRunDateTextChange = (value: string) => {
    const formatted = formatDateInput(value);
    setFormData((prev) => ({ ...prev, runDate: formatted }));

    // Validate if complete
    if (formatted.length === 10) {
      const error = validateRunDate(formatted, formData.createDate);
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
    return convertDisplayToDatePicker(dateStr);
  };

  // Handle phone number input to only allow numbers
  const handlePhoneChange = (value: string) => {
    const numericValue = formatPhoneInput(value);
    handleInputChange("phoneNumber", numericValue);
  };

  // Handle search phone - Call API to search user by phone number
  const handleSearchPhone = async () => {
    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      alert("Please enter a phone number");
      return;
    }

    try {
      console.log("Searching for phone:", formData.phoneNumber);

      // Call API to get user by phone number
      const userData = await getUserByPhoneNumber(formData.phoneNumber);

      if (userData) {
        // Check if user status is inactive
        if (userData.status === "inactive") {
          // User is inactive - show error and don't fill data
          setFoundUserId(null);
          setErrors((prev) => ({
            ...prev,
            phoneNumber: "This patient account is inactive and cannot be used",
          }));
          console.log("User found but status is inactive:", userData);
          return;
        }

        // User found and active - save userId and auto-fill patient information
        setFoundUserId(userData.userId); // Store the userId for later use

        setFormData((prev) => ({
          ...prev,
          patientName: userData.name || "-----",
          age: userData.age ? userData.age.toString() : "-----",
          gender: userData.gender || "-----",
        }));

        // Clear phone error if any
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "",
        }));

        console.log("User found and data filled:", userData);
        console.log("Saved userId:", userData.userId);
        alert(`Patient found: ${userData.name}`);
      } else {
        // User not found - clear saved userId
        setFoundUserId(null);
        alert("No patient found with this phone number");
        console.log("No user found with phone:", formData.phoneNumber);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      alert("An error occurred while searching. Please try again.");
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      !errors.phoneNumber &&
      !errors.testType &&
      !errors.runDate &&
      formData.phoneNumber.trim() &&
      formData.testType.trim() &&
      formData.runDate.trim()
    );
  };

  const handleSave = async () => {
    try {
      // Call API service to create test order with existing userId if found
      const result = await addTestOrder(formData, foundUserId);

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
            <ReturningPatientOrderPage
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handlePhoneChange={handlePhoneChange}
              handleSearchPhone={handleSearchPhone}
              handleRunDateChange={handleRunDateChange}
              handleRunDateTextChange={handleRunDateTextChange}
              getDateInputValue={getDateInputValue}
            />

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
