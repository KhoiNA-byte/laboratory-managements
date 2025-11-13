// src/components/SyncInstrumentsPopup.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Instrument } from '../../store/types';

interface SyncInstrumentsPopupProps {
  onClose: () => void;
}

interface SyncFormData {
  firmwareVersion: string;
  port: string;
  sampleVolume: string;
  encryption: string;
  ipAddress: string;
  temperature: string;
}

type SyncStep = 'devices' | 'configuration';

const SyncInstrumentsPopup: React.FC<SyncInstrumentsPopupProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { instruments } = useSelector((state: RootState) => state.instruments);
  
  const [currentStep, setCurrentStep] = useState<SyncStep>('devices');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [formData, setFormData] = useState<SyncFormData>({
    firmwareVersion: '',
    port: '',
    sampleVolume: '',
    encryption: '',
    ipAddress: '',
    temperature: ''
  });

  const handleInstrumentSelect = (instrumentId: string) => {
    setSelectedInstruments(prev =>
      prev.includes(instrumentId)
        ? prev.filter(id => id !== instrumentId)
        : [...prev, instrumentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInstruments.length === instruments.length) {
      setSelectedInstruments([]);
    } else {
      setSelectedInstruments(instruments.map(instr => instr.id));
    }
  };

  const handleInputChange = (field: keyof SyncFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (selectedInstruments.length === 0) {
      alert('Please select at least one instrument');
      return;
    }
    setCurrentStep('configuration');
  };

  const handleBack = () => {
    setCurrentStep('devices');
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      // Tạo payload cho từng instrument được chọn
      const updatePromises = selectedInstruments.map(instrumentId => {
        const updatePayload = {
          id: instrumentId,
          firmwareVersion: formData.firmwareVersion || undefined,
          port: formData.port ? parseInt(formData.port) : undefined,
          sampleVolume: formData.sampleVolume ? parseInt(formData.sampleVolume) : undefined,
          encryption: formData.encryption || undefined,
          ipAddress: formData.ipAddress || undefined,
          temperature: formData.temperature ? parseInt(formData.temperature) : undefined
        };

        // Loại bỏ các field rỗng
        const cleanPayload = Object.fromEntries(
          Object.entries(updatePayload).filter(([_, value]) => value !== undefined && value !== '')
        );

        return dispatch({ 
          type: 'instruments/updateInstrumentRequest', 
          payload: cleanPayload
        });
      });

      await Promise.all(updatePromises);
      
      alert(`Successfully synced ${selectedInstruments.length} instrument(s)`);
      onClose();
      
    } catch (error) {
      console.error('Sync error:', error);
      alert('Error syncing instruments');
    } finally {
      setSyncing(false);
    }
  };

  const selectedCount = selectedInstruments.length;
  const totalCount = instruments.length;

  // Step 1: Target Devices
  const renderDevicesStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select Target Devices</h3>
        <p className="text-gray-600 text-sm">
          Choose the instruments you want to update with new configuration
        </p>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-700">
          {selectedCount} of {totalCount} instruments selected
        </span>
        <button
          onClick={handleSelectAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
        {instruments.map((instrument) => (
          <div
            key={instrument.id}
            className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedInstruments.includes(instrument.id)}
              onChange={() => handleInstrumentSelect(instrument.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{instrument.name}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  instrument.status === 'Active' ? 'bg-green-100 text-green-800' :
                  instrument.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {instrument.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {instrument.model} • {instrument.serialNumber}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>📍 {instrument.location}</span>
                {instrument.ipAddress && <span>🌐 {instrument.ipAddress}</span>}
                {instrument.firmwareVersion && <span>🔧 {instrument.firmwareVersion}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 2: Configuration
  const renderConfigurationStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Configuration Settings</h3>
        <p className="text-gray-600 text-sm">
          Update configuration for {selectedCount} selected instrument(s)
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-700">
            Only filled fields will be updated. Empty fields will keep their current values.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Firmware Version
          </label>
          <input
            type="text"
            value={formData.firmwareVersion}
            onChange={(e) => handleInputChange('firmwareVersion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., v2.1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP Address
          </label>
          <input
            type="text"
            value={formData.ipAddress}
            onChange={(e) => handleInputChange('ipAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 192.168.1.100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port
          </label>
          <input
            type="number"
            value={formData.port}
            onChange={(e) => handleInputChange('port', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 8080"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Volume (μL)
          </label>
          <input
            type="number"
            value={formData.sampleVolume}
            onChange={(e) => handleInputChange('sampleVolume', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encryption
          </label>
          <select
            value={formData.encryption}
            onChange={(e) => handleInputChange('encryption', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Keep current encryption</option>
            <option value="AES-128">AES-128</option>
            <option value="AES-256">AES-256</option>
            <option value="TLS">TLS</option>
            <option value="SSL">SSL</option>
            <option value="None">None</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature (°C)
          </label>
          <input
            type="number"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 25"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sync Instruments</h2>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentStep === 'devices' ? 'bg-blue-600' : 'bg-gray-300'
                }`}></div>
                <span className={`text-sm ${
                  currentStep === 'devices' ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  Target Devices
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentStep === 'configuration' ? 'bg-blue-600' : 'bg-gray-300'
                }`}></div>
                <span className={`text-sm ${
                  currentStep === 'configuration' ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  Configuration
                </span>
              </div>
            </div>
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
          {currentStep === 'devices' ? renderDevicesStep() : renderConfigurationStep()}
        </div>

        {/* Footer */}
        <div className="flex justify-between space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          {currentStep === 'devices' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={selectedCount === 0}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Next: Configuration ({selectedCount})
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={syncing}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Back to Devices
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  disabled={syncing}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {syncing && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>
                    {syncing ? `Syncing ${selectedCount} device(s)...` : `Sync ${selectedCount} Device(s)`}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncInstrumentsPopup;