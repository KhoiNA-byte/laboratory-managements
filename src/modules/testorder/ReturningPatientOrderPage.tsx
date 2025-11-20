import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TestOrderFormData } from "../../types/testOrder";
import { getTestTypes, TestType } from "../../services/testOrderApi";

interface ReturningPatientOrderPageProps {
  formData: TestOrderFormData;
  errors: {
    patientName: string;
    age: string;
    gender: string;
    phoneNumber: string;
    note: string;
    runDate: string;
    testType: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handlePhoneChange: (value: string) => void;
  handleSearchPhone: () => void;
  handleRunDateChange: (value: string) => void;
  handleRunDateTextChange: (value: string) => void;
  getDateInputValue: (dateStr: string) => string;
}

export const ReturningPatientOrderPage: React.FC<
  ReturningPatientOrderPageProps
> = ({
  formData,
  errors,
  handleInputChange,
  handlePhoneChange,
  handleSearchPhone,
  handleRunDateChange,
  handleRunDateTextChange,
  getDateInputValue,
}) => {
  const { t } = useTranslation("common");
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [loadingTestTypes, setLoadingTestTypes] = useState(true);

  // Fetch test types on component mount
  useEffect(() => {
    const fetchTestTypes = async () => {
      try {
        setLoadingTestTypes(true);
        const result = await getTestTypes();
        if (result.success) {
          setTestTypes(result.data);
        } else {
          console.error('Failed to fetch test types:', result.message);
        }
      } catch (error) {
        console.error('Error fetching test types:', error);
      } finally {
        setLoadingTestTypes(false);
      }
    };

    fetchTestTypes();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Phone Number with Search Button */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("modals.testOrder.phoneNumber")} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={t("modals.testOrder.phoneNumber")}
              className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={handleSearchPhone}
              disabled={
                !formData.phoneNumber || formData.phoneNumber.length !== 10
              }
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {t("modals.testOrder.search")}
            </button>
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Patient Name - Disabled */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("modals.testOrder.patientName")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.patientName}
            placeholder="-----"
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Age - Disabled */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("modals.testOrder.age")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.age}
            placeholder="-----"
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Gender - Disabled */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("modals.testOrder.gender")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.gender}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none bg-gray-100 cursor-not-allowed"
            >
              <option value="">-----</option>
              <option value="Male">{t("modals.createUser.genderOptions.male")}</option>
              <option value="Female">{t("modals.createUser.genderOptions.female")}</option>
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
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Status */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("modals.testOrder.status")}
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
            {t("modals.testOrder.testType")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.testType}
              onChange={(e) => handleInputChange("testType", e.target.value)}
              disabled={loadingTestTypes}
              size={1}
              style={{ maxHeight: '200px', overflowY: 'auto' }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                errors.testType ? "border-red-500" : "border-gray-300"
              } ${loadingTestTypes ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {loadingTestTypes ? t("common.loading") : t("modals.testOrder.selectTestType")}
              </option>
              {testTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
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

        {/* Note */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("modals.testOrder.note")}
          </label>
          <input
            type="text"
            value={formData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
            placeholder={t("modals.testOrder.enterNote")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.note ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.note && (
            <p className="text-red-500 text-sm mt-1">{errors.note}</p>
          )}
        </div>

        {/* Run Date */}
        <div className="h-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("modals.testOrder.runDate")} <span className="text-red-500">*</span>
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
