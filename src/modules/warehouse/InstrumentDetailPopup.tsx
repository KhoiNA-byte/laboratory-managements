// src/components/InstrumentDetailPopup.tsx
import React from 'react';
import { Instrument } from '../../store/types'

interface InstrumentDetailsPopupProps {
  instrument: Instrument | null;
  onClose: () => void;
  onEdit: (instrument: Instrument) => void;
}

const InstrumentDetailsPopup: React.FC<InstrumentDetailsPopupProps> = ({ 
  instrument, 
  onClose,
  onEdit 
}) => {
  if (!instrument) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Tính số ngày còn lại đến lần hiệu chuẩn tiếp theo
  const getDaysUntilCalibration = () => {
    const calibrationDate = new Date(instrument.nextCalibration);
    const today = new Date();
    const diffTime = calibrationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilCalibration = getDaysUntilCalibration();
  const isCalibrationDueSoon = daysUntilCalibration <= 7;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Instrument Details</h2>
            <p className="text-gray-600 text-sm mt-1">Complete information about {instrument.name}</p>
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

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Instrument Name</label>
                <p className="text-gray-900 font-medium">{instrument.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Model</label>
                <p className="text-gray-900 font-medium">{instrument.model}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Serial Number</label>
                <p className="text-gray-900 font-medium">{instrument.serialNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(instrument.status)}`}>
                  {instrument.status}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Location</label>
                <p className="text-gray-900 font-medium">{instrument.location}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Manufacturer</label>
                <p className="text-gray-900 font-medium">{instrument.manufacturer}</p>
              </div>
            </div>
          </div>

          {/* Calibration Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calibration Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Next Calibration</label>
                <p className="text-gray-900 font-medium">{instrument.nextCalibration}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Calibration Status</label>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    instrument.calibrationDue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {instrument.calibrationDue ? 'Due Soon' : 'On Track'}
                  </span>
                  {isCalibrationDueSoon && (
                    <span className="text-sm text-red-600">
                      ({daysUntilCalibration} days remaining)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Calibration Alert */}
          {isCalibrationDueSoon && (
            <div className="mb-6">
              <div className={`border rounded-lg p-4 ${
                instrument.calibrationDue 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      instrument.calibrationDue ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <svg 
                        className={`w-5 h-5 ${instrument.calibrationDue ? 'text-red-600' : 'text-blue-600'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`font-medium ${
                        instrument.calibrationDue ? 'text-red-800' : 'text-blue-800'
                      }`}>
                        {instrument.calibrationDue ? 'Calibration Due!' : 'Calibration due soon'}
                      </p>
                      <p className={`text-sm ${
                        instrument.calibrationDue ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        Next calibration: {instrument.nextCalibration}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      instrument.calibrationDue ? 'text-red-800' : 'text-blue-800'
                    }`}>
                      {daysUntilCalibration} days remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instrument ID */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="text-sm text-gray-500 block mb-1">Instrument ID</label>
            <p className="text-gray-900 font-mono text-sm">{instrument.id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(instrument);
              onClose();
            }}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Instrument
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstrumentDetailsPopup;