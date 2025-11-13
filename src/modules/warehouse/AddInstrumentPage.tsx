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
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    status: "Active" as "Active" | "Maintenance" | "Inactive",
    location: "",
    nextCalibration: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim() || !formData.model.trim() || !formData.serialNumber.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const newInstrument = {
        name: formData.name,
        model: formData.model,
        serialNumber: formData.serialNumber,
        manufacturer: formData.manufacturer,
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter instrument name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter model"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter serial number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter manufacturer"
                  required
                />
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
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Calibration <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.nextCalibration}
                  onChange={(e) => handleInputChange('nextCalibration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
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