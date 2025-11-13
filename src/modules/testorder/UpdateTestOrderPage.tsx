import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTestOrderDetailById,
  updateTestOrderById,
} from "../../services/testOrderApi";
import { validateTester, validateTestType } from "../../utils/validation";

interface UpdateFormData {
  testType: string;
  status: string;
  priority: string;
  note: string;
  tester: string;
}

interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  address: string;
}

const UpdateTestOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateFormData>({
    testType: "",
    status: "Pending",
    priority: "Routine",
    note: "",
    tester: "",
  });

  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    testType: "",
    tester: "",
  });

  const [createdAt, setCreatedAt] = useState("");
  const [orderedAt, setOrderedAt] = useState("");

  // Fetch test order data
  useEffect(() => {
    const fetchTestOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const result = await getTestOrderDetailById(orderId);

        if (result.success && result.data) {
          const data = result.data;

          // Set form data
          setFormData({
            testType: data.testType || "",
            status: data.status || "Pending",
            priority: data.priority || "Routine",
            note: data.note || "",
            tester: data.testerName || "",
          });

          // Set patient info
          setPatientInfo({
            name: data.patientName,
            email: data.patientEmail,
            phone: data.patientPhone,
            gender: data.patientGender,
            age: data.patientAge,
            address: data.patientAddress,
          });

          // Set timestamps
          setCreatedAt(data.createdAt);
          setOrderedAt(data.ordered);
        } else {
          alert("Failed to fetch test order details");
          navigate("/admin/test-orders");
        }
      } catch (error) {
        console.error("Error fetching test order:", error);
        alert("An error occurred while fetching test order");
        navigate("/admin/test-orders");
      } finally {
        setLoading(false);
      }
    };

    fetchTestOrder();
  }, [orderId, navigate]);

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate the field
    let error = "";
    switch (field) {
      case "tester":
        error = validateTester(value);
        break;
      case "testType":
        error = validateTestType(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      !errors.tester &&
      !errors.testType &&
      formData.tester.trim() &&
      formData.testType.trim()
    );
  };

  const handleUpdate = async () => {
    if (!orderId) return;

    try {
      const result = await updateTestOrderById(orderId, formData);

      if (result.success) {
        alert("Test order updated successfully");
        navigate("/admin/test-orders");
      } else {
        alert("Failed to update test order. Please try again.");
      }
    } catch (error) {
      console.error("Error updating test order:", error);
      alert("An error occurred while updating. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/test-orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-600">Loading test order...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Update Test Order
            </h1>
            <p className="text-gray-600 mt-1">
              Update the test order details - Order #{orderId}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Patient Information (Read-only) */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Patient Information (Read-only)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={patientInfo.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={patientInfo.phone}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    value={patientInfo.age}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={patientInfo.gender}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created At
                  </label>
                  <input
                    type="text"
                    value={createdAt}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordered At
                  </label>
                  <input
                    type="text"
                    value={orderedAt}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Editable Test Order Fields */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Test Order Details (Editable)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Test Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.testType}
                    onChange={(e) =>
                      handleInputChange("testType", e.target.value)
                    }
                    placeholder="Enter test type"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.testType ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.testType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.testType}
                    </p>
                  )}
                </div>

                {/* Tester */}
                <div>
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

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Reviewed">Reviewed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Stat">Stat</option>
                  </select>
                </div>

                {/* Note - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    placeholder="Enter any notes or observations"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!isFormValid()}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isFormValid()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Update Test Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTestOrderPage;
