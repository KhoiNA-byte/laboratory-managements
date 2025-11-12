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

  // 🔹 Action handlers
  const handleViewDetails = (instrument: Instrument) => {
    console.log('View details:', instrument);
    setShowActionsDropdown(null);
  };

  const handleEditInstrument = (instrument: Instrument) => {
    console.log('Edit instrument:', instrument);
    setShowActionsDropdown(null);
  };

  const handleDeleteInstrument = (instrument: Instrument) => {
    console.log('Delete instrument:', instrument);
    setShowActionsDropdown(null);
  };

  // 🔹 UI helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Operational':
        return 'bg-green-100 text-green-800';
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
          <div className="text-xl font-semibold text-gray-900">{instruments.length} equipment</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">Active</div>
          <div className="text-xl font-semibold text-gray-900">
            {instruments.filter(i => i.status === 'Active' || i.status === 'Operational').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">Maintenance</div>
          <div className="text-xl font-semibold text-gray-900">
            {instruments.filter(i => i.status === 'Maintenance').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">Calibration Due</div>
          <div className="text-xl font-semibold text-gray-900">
            {instruments.filter(i => {
              if (!i.nextCalibration) return false;
              const calibrationDate = new Date(i.nextCalibration);
              const today = new Date();
              const diffTime = calibrationDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7;
            }).length}
          </div>
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
      <div className="flex items-center space-x-3">
        {/* Sync-up Button */}
        <button
          onClick={() => console.log('Sync-up clicked')}
          className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Sync-up</span>
        </button>

        {/* Add Instrument Button */}
        <button
          onClick={() => console.log('Add Instrument clicked')}
          className="flex items-center space-x-2 bg-blue-600 rounded-lg px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Instrument</span>
        </button>

        {/* Search Input */}
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search instruments..."
            className="border rounded-lg pl-10 pr-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
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
          <div key={instrument.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            {/* Instrument Header với dropdown menu */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{instrument.name}</h3>
                <p className="text-sm text-gray-600">{instrument.model}</p>
              </div>
              <div className="relative dropdown-container">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionsDropdown(showActionsDropdown === instrument.id ? null : instrument.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showActionsDropdown === instrument.id && (
                  <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-2 w-48 z-10">
                    <button 
                      onClick={() => handleViewDetails(instrument)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleEditInstrument(instrument)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Edit Instrument
                    </button>
                    <button 
                      onClick={() => handleDeleteInstrument(instrument)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Delete Instrument
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Instrument Details - Layout 2 cột với values sát lề phải */}
            <div className="mb-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-sm">Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(instrument.status)}`}>
                  {instrument.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-sm">Serial Number</span>
                <span className="text-gray-900 text-sm font-medium text-right">{instrument.serialNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-sm">Location</span>
                <span className="text-gray-900 text-sm font-medium text-right">{instrument.location}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-sm">Manufacturer</span>
                <span className="text-gray-900 text-sm font-medium text-right">{instrument.manufacturer}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-sm">Next Calibration</span>
                <span className="text-gray-900 text-sm font-medium text-right">{instrument.nextCalibration}</span>
              </div>
            </div>

            {/* Calibration Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800 text-sm font-medium">Calibration due soon</span>
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