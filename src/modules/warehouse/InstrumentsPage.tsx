// src/pages/InstrumentsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstruments } from '../../services/instruments';
import { Instrument } from '../../store/types';

const InstrumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch data from MockAPI
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getInstruments();
      setInstruments(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showActionsDropdown && !target.closest('.dropdown-container')) {
        setShowActionsDropdown(null);
      }
    };
    if (showActionsDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActionsDropdown]);

  // 🔹 Filter by search
  const filteredInstruments = instruments.filter(i =>
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 UI helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 🔹 Loading state
  if (loading) return <p className="text-center py-10 text-gray-500">Loading instruments...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Instruments</h1>
        <p className="text-gray-600">Manage laboratory instruments and equipment</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">Total Instruments</div>
          <div className="text-xl font-semibold text-gray-900">All equipment</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">Active</div>
          <div className="text-xl font-semibold text-gray-900">Operational</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">Maintenance</div>
          <div className="text-xl font-semibold text-gray-900">Under service</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">Calibration Due</div>
          <div className="text-xl font-semibold text-gray-900">Within 7 days</div>
        </div>
      </div>

      {/* All Instruments Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Instruments</h2>
              <p className="text-gray-600 text-sm">View and manage laboratory equipment</p>
            </div>
            <input
              type="text"
              placeholder="Search Instruments..."
              className="border rounded-lg px-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Instruments Grid */}
        <div className="p-6">
          {filteredInstruments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No instruments found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstruments.map((instrument) => (
                <div key={instrument.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Instrument Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{instrument.name}</h3>
                      <p className="text-sm text-gray-600">{instrument.model}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className={`text-sm font-medium ${
                        instrument.status === 'Operational' ? 'text-green-600' : 
                        instrument.status === 'Maintenance' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {instrument.status}
                      </div>
                    </div>
                  </div>

                  {/* Instrument Details */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Serial Number</span>
                      <span className="text-gray-900">{instrument.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="text-gray-900">{instrument.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Manufacturer</span>
                      <span className="text-gray-900">{instrument.manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Calibration</span>
                      <span className="text-gray-900">{instrument.nextCalibration}</span>
                    </div>
                  </div>

                  {/* Calendar Due Soon */}
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 text-sm font-medium">Calendar due soon</span>
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default InstrumentsPage;
