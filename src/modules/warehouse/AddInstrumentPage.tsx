import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Instrument } from '../../store/types';

interface AddInstrumentPopupProps {
  onClose: () => void;
  onSave: (instrument: Instrument) => void;
}

const AddInstrumentPopup: React.FC<AddInstrumentPopupProps> = ({ 
  onClose,
  onSave 
}) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    status: "Active" as "Active" | "Maintenance" | "Inactive",
    location: "",
    nextCalibration: "",
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

  // Validation functions
  const validateField = (field: string, value: string): string => {
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Instrument name is required';
        if (specialCharRegex.test(value)) return 'Instrument name cannot contain special characters';
        if (value.trim().length < 2) return 'Instrument name must be at least 2 characters';
        return '';
      
      case 'model':
        if (!value.trim()) return 'Model is required';
        if (specialCharRegex.test(value)) return 'Model cannot contain special characters';
        return '';
      
      case 'serialNumber':
        if (!value.trim()) return 'Serial number is required';
        if (specialCharRegex.test(value)) return 'Serial number cannot contain special characters';
        return '';
      
      case 'manufacturer':
        if (!value.trim()) return 'Manufacturer is required';
        if (specialCharRegex.test(value)) return 'Manufacturer cannot contain special characters';
        return '';
      
      case 'location':
        if (!value.trim()) return 'Location is required';
        return '';
      
      case 'nextCalibration':
        if (!value.trim()) return 'Next calibration date is required';
        if (new Date(value) <= new Date()) return 'Next calibration must be in the future';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
      alert('Please fix all validation errors before saving');
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
      alert('Error creating instrument');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (formData.name || formData.model || formData.serialNumber) {
      if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Instrument</h2>
            <p className="text-gray-600 text-sm mt-1">Create a new laboratory instrument</p>
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
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter instrument name"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter model"
                  required
                />
                {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter serial number"
                  required
                />
                {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.manufacturer ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter manufacturer"
                  required
                />
                {errors.manufacturer && <p className="text-red-500 text-xs mt-1">{errors.manufacturer}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a location</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Calibration <span className="text-red-500">*</span>
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
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{saving ? 'Creating...' : 'Create Instrument'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInstrumentPopup;