// src/components/EditInstrumentPopup.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Instrument } from '../../store/types';

interface EditInstrumentPopupProps {
  instrument: Instrument | null;
  onClose: () => void;
  onSave: (instrument: Instrument) => void;
}

const EditInstrumentPopup: React.FC<EditInstrumentPopupProps> = ({ 
  instrument, 
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

  // Load instrument data when popup opens
  useEffect(() => {
    if (instrument) {
      setFormData({
        name: instrument.name,
        model: instrument.model,
        serialNumber: instrument.serialNumber,
        manufacturer: instrument.manufacturer,
        status: instrument.status,
        location: instrument.location,
        nextCalibration: instrument.nextCalibration,
      });
    }
  }, [instrument]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!instrument) return;
    
    // Basic validation
    if (!formData.name.trim() || !formData.model.trim() || !formData.serialNumber.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const updatePayload = {
        id: instrument.id,
        name: formData.name,
        model: formData.model,
        serialNumber: formData.serialNumber,
        manufacturer: formData.manufacturer,
        status: formData.status,
        location: formData.location,
        nextCalibration: formData.nextCalibration,
        calibrationDue: false // You can calculate this based on nextCalibration
      };

      // Dispatch update action
      dispatch({ 
        type: 'instruments/updateInstrumentRequest', 
        payload: updatePayload
      });
      
      // Call onSave callback
      onSave(updatePayload as Instrument);
      onClose();
    } catch (error) {
      console.error('Error saving instrument:', error);
      alert('Error saving instrument');
    } finally {
      setSaving(false);
    }
  };

  if (!instrument) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Instrument</h2>
            <p className="text-gray-600 text-sm mt-1">Update instrument information</p>
          </div>
          <button
            onClick={onClose}
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
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

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
                  required
                />
              </div>
            </div>
          </div>

          {/* Next Calibration - Full width */}
          <div className="mt-4">
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

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
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
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInstrumentPopup;