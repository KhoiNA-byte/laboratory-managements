import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Instrument } from '../../store/types';

interface AddInstrumentPopupProps {
  onClose: () => void;
  onSave: (instrument: Instrument) => void;
}

interface TestType {
  id: string;
  name: string;
}

interface Reagent {
  id: string;
  name: string;
  lot_number: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  location: string;
}

const AddInstrumentPopup: React.FC<AddInstrumentPopupProps> = ({ 
  onClose,
  onSave 
}) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [loading, setLoading] = useState({
    testTypes: false,
    reagents: false
  });
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    status: "Active" as "Active" | "Maintenance" | "Inactive",
    location: "",
    nextCalibration: "",
    supportedTest: "", // Single selection
    supportedReagents: [] as string[], // Multiple selection
  });

  // Predefined location options
  const locationOptions = [
    "L-001",
    "L-002", 
    "L-003",
    "L-004",
    "L-005",
    "L-006",
    "L-007",
    "L-008"
  ];

  // Fetch test types and reagents từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch data...');
        setLoading(prev => ({ ...prev, testTypes: true, reagents: true }));
        setFetchError(null);

        // Fetch test types
        const testTypesPromise = fetch('https://69085724b49bea95fbf32f71.mockapi.io/test_type')
          .then(response => {
            if (!response.ok) throw new Error(`Test types API error: ${response.status}`);
            return response.json();
          });

        // Fetch reagents
        const reagentsPromise = fetch('https://69085724b49bea95fbf32f71.mockapi.io/reagents')
          .then(response => {
            if (!response.ok) throw new Error(`Reagents API error: ${response.status}`);
            return response.json();
          });

        const [testTypesResult, reagentsResult] = await Promise.allSettled([
          testTypesPromise,
          reagentsPromise
        ]);

        // Xử lý test types
        if (testTypesResult.status === 'fulfilled') {
          setTestTypes(Array.isArray(testTypesResult.value) ? testTypesResult.value : []);
        } else {
          console.error('Failed to fetch test types:', testTypesResult.reason);
          setTestTypes([]);
        }

        // Xử lý reagents
        if (reagentsResult.status === 'fulfilled') {
          setReagents(Array.isArray(reagentsResult.value) ? reagentsResult.value : []);
        } else {
          console.error('Failed to fetch reagents:', reagentsResult.reason);
          setReagents([]);
        }

      } catch (error) {
        console.error('Error in fetchData:', error);
        setFetchError('Failed to load data. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, testTypes: false, reagents: false }));
      }
    };

    fetchData();
  }, []);

  // Validation functions
  const validateField = (field: string, value: any): string => {
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    
    switch (field) {
      case 'name':
        if (!value.trim()) return t("modals.addInstrument.validation.nameRequired");
        if (specialCharRegex.test(value)) return t("modals.addInstrument.validation.nameSpecialChars");
        if (value.trim().length < 2) return t("modals.addInstrument.validation.nameMinLength");
        return '';
      
      case 'model':
        if (!value.trim()) return t("modals.addInstrument.validation.modelRequired");
        if (specialCharRegex.test(value)) return t("modals.addInstrument.validation.modelSpecialChars");
        return '';
      
      case 'serialNumber':
        if (!value.trim()) return t("modals.addInstrument.validation.serialRequired");
        if (specialCharRegex.test(value)) return t("modals.addInstrument.validation.serialSpecialChars");
        return '';
      
      case 'manufacturer':
        if (!value.trim()) return t("modals.addInstrument.validation.manufacturerRequired");
        if (specialCharRegex.test(value)) return t("modals.addInstrument.validation.manufacturerSpecialChars");
        return '';
      
      case 'location':
        if (!value.trim()) return t("modals.addInstrument.validation.locationRequired");
        return '';
      
      case 'nextCalibration':
        if (!value.trim()) return t("modals.addInstrument.validation.calibrationRequired");
        if (new Date(value) <= new Date()) return t("modals.addInstrument.validation.calibrationFuture");
        return '';
      
      case 'supportedTest':
        if (!value.trim()) return t("modals.addInstrument.validation.testTypeRequired");
        return '';
      
      case 'supportedReagents':
        if (!value.length) return t("modals.addInstrument.validation.reagentsRequired");
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Xử lý chọn/bỏ chọn reagent
  const handleReagentChange = (reagentId: string) => {
    setFormData(prev => {
      const currentReagents = prev.supportedReagents;
      const updatedReagents = currentReagents.includes(reagentId)
        ? currentReagents.filter(id => id !== reagentId)
        : [...currentReagents, reagentId];
      
      return {
        ...prev,
        supportedReagents: updatedReagents
      };
    });

    // Clear error nếu có
    if (errors.supportedReagents) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.supportedReagents;
        return newErrors;
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert(t("modals.addInstrument.validation.fixErrors"));
      return;
    }

    try {
      setSaving(true);
      
      const newInstrument = {
        name: formData.name.trim(),
        model: formData.model.trim(),
        serialNumber: formData.serialNumber.trim(),
        manufacturer: formData.manufacturer.trim(),
        status: formData.status,
        location: formData.location,
        nextCalibration: formData.nextCalibration,
        supportedTest: formData.supportedTest,
        supportedReagents: formData.supportedReagents,
        calibrationDue: false
      };

      // Dispatch create action via Redux Saga
      dispatch({ 
        type: 'instruments/addInstrumentRequest', 
        payload: newInstrument
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving instrument:', error);
      alert(t("modals.addInstrument.validation.errorCreating"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (formData.name || formData.model || formData.serialNumber) {
      if (window.confirm(t("modals.addInstrument.validation.cancelConfirm"))) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Get minimum date for calibration (tomorrow)
  const getMinCalibrationDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t("modals.addInstrument.title")}</h2>
            <p className="text-gray-600 text-sm mt-1">{t("modals.addInstrument.subtitle")}</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t("modals.addInstrument.basicInformation")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("modals.addInstrument.instrumentName")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t("modals.addInstrument.placeholders.instrumentName")}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("modals.addInstrument.model")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t("modals.addInstrument.placeholders.model")}
                    required
                  />
                  {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("modals.addInstrument.serialNumber")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t("modals.addInstrument.placeholders.serialNumber")}
                    required
                  />
                  {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("modals.addInstrument.manufacturer")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.manufacturer ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t("modals.addInstrument.placeholders.manufacturer")}
                    required
                  />
                  {errors.manufacturer && <p className="text-red-500 text-xs mt-1">{errors.manufacturer}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("modals.addInstrument.status")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">{t("common.active")}</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">{t("common.inactive")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("modals.addInstrument.location")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">{t("modals.addInstrument.selectLocation")}</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Calibration Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t("modals.addInstrument.calibrationInformation")}</h3>
            <div className="max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("modals.addInstrument.nextCalibrationDate")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.nextCalibration}
                  onChange={(e) => handleInputChange('nextCalibration', e.target.value)}
                  min={getMinCalibrationDate()}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nextCalibration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.nextCalibration && <p className="text-red-500 text-xs mt-1">{errors.nextCalibration}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Testing Configuration */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t("modals.addInstrument.testingConfiguration")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supported Test Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("modals.addInstrument.supportedTestType")} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.supportedTest}
                  onChange={(e) => handleInputChange('supportedTest', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.supportedTest ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  disabled={loading.testTypes}
                >
                  <option value="">{t("modals.addInstrument.selectTestType")}</option>
                  {testTypes.map((testType) => (
                    <option key={testType.id} value={testType.id}>
                      {testType.id} - {testType.name}
                    </option>
                  ))}
                </select>
                {loading.testTypes && <p className="text-blue-500 text-xs mt-1">{t("modals.addInstrument.loadingTestTypes")}</p>}
                {errors.supportedTest && <p className="text-red-500 text-xs mt-1">{errors.supportedTest}</p>}
              </div>

              {/* Supported Reagents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("modals.addInstrument.supportedReagents")} <span className="text-red-500">*</span>
                </label>
                <div className={`max-h-48 overflow-y-auto border rounded-md p-3 ${
                  errors.supportedReagents ? 'border-red-500' : 'border-gray-300'
                } ${loading.reagents ? 'opacity-50' : ''}`}>
                  {loading.reagents ? (
                    <p className="text-gray-500 text-sm">{t("modals.addInstrument.loadingReagents")}</p>
                  ) : reagents.length === 0 ? (
                    <p className="text-gray-500 text-sm">{t("modals.addInstrument.noReagentsAvailable")}</p>
                  ) : (
                    <div className="space-y-2">
                      {reagents.map((reagent) => (
                        <label key={reagent.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg border border-gray-200">
                          <input
                            type="checkbox"
                            checked={formData.supportedReagents.includes(reagent.id)}
                            onChange={() => handleReagentChange(reagent.id)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={loading.reagents}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-sm">{reagent.name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                reagent.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {reagent.quantity} {reagent.unit}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1 space-y-1">
                              <div>Lot: {reagent.lot_number} • Mfg: {reagent.manufacturer}</div>
                              <div>Expires: {formatDate(reagent.expiry_date)} • Storage: {reagent.location}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.supportedReagents && (
                  <p className="text-red-500 text-xs mt-1">{errors.supportedReagents}</p>
                )}
                {formData.supportedReagents.length > 0 && (
                  <p className="text-green-600 text-xs mt-1">
                    {t("modals.addInstrument.reagentsSelected", { count: formData.supportedReagents.length })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading.testTypes || loading.reagents}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>
              {saving ? t("modals.addInstrument.creating") : 
               loading.testTypes || loading.reagents ? t("modals.addInstrument.loadingData") : t("modals.addInstrument.createInstrument")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInstrumentPopup;