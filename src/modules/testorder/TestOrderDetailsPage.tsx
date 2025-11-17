import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTestOrderDetailById,
  TestOrderDetail,
} from "../../services/testOrderApi";

const TestOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [testOrderData, setTestOrderData] = useState<TestOrderDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test order details from API
  useEffect(() => {
    const fetchTestOrderDetail = async () => {
      if (!orderId) {
        setError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getTestOrderDetailById(orderId);

        if (response.success && response.data) {
          setTestOrderData(response.data);
          setError(null);
        } else {
          setError(response.message || "Không thể tải chi tiết test order");
          setTestOrderData(null);
        }
      } catch (err) {
        console.error("Error fetching test order detail:", err);
        setError("Có lỗi xảy ra khi tải chi tiết test order");
        setTestOrderData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestOrderDetail();
  }, [orderId]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleEditOrder = () => {
    navigate(`/admin/test-orders/${orderId}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900 mb-2">
                Loading...
              </div>
              <div className="text-sm text-gray-500">
                Loading test order details...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !testOrderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="text-lg font-medium text-red-600 mb-2">Error</div>
              <div className="text-sm text-gray-700 mb-4">
                {error || "Test order not found"}
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Go Back
              </button>
            </div>
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
              Test Order Detail - {testOrderData.id}
            </h1>
            <p className="text-gray-600 mt-1">View test order information</p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={testOrderData.patientName}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Type
                  </label>
                  <input
                    type="text"
                    value={testOrderData.testType}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={testOrderData.patientAge}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={testOrderData.patientGender}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth (MM/DD/YYYY)
                  </label>
                  <input
                    type="text"
                    value={testOrderData.patientDateOfBirth}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tester
                  </label>
                  <input
                    type="text"
                    value={testOrderData.testerName}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={testOrderData.patientEmail}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={testOrderData.patientPhone}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={testOrderData.patientAddress}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <input
                    type="text"
                    value={testOrderData.status}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <input
                    type="text"
                    value={testOrderData.priority}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordered Date
                  </label>
                  <input
                    type="text"
                    value={testOrderData.ordered}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  value={testOrderData.note}
                  readOnly
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Result
                </label>
                <textarea
                  value={testOrderData.testResult}
                  readOnly
                  rows={4}
                  placeholder="Test results will appear here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleEditOrder}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOrderDetailsPage;
