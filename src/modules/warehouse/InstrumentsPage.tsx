// src/pages/InstrumentsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Instrument } from '../../store/types';
import InstrumentDetailsPopup from './InstrumentDetailPopup';
import EditInstrumentPopup from './EditInstrumentPage';
import AddInstrumentPopup from './AddInstrumentPage';
import SyncInstrumentsPopup from './SyncInstrumentsPopup';


const InstrumentsPage: React.FC = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use Redux store instead of local state
  const { instruments, loading, error } = useSelector((state: RootState) => state.instruments);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showSyncPopup, setShowSyncPopup] = useState(false);

  // 🔹 Fetch data from Redux Saga
  useEffect(() => {
    dispatch({ type: 'instruments/fetchInstrumentsStart' });
  }, [dispatch]);

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
    setSelectedInstrument(instrument);
    setShowActionsDropdown(null);
  };

  const handleEditInstrument = (instrument: Instrument) => {
    setEditingInstrument(instrument);
    setShowActionsDropdown(null);
  };

  const handleDeleteInstrument = async (instrument: Instrument) => {
    if (window.confirm(t("instrumentsPage.table.confirmDelete", { name: instrument.name }))) {
      try {
        setDeleteLoading(instrument.id);
        
        await dispatch({ 
          type: 'instruments/deleteInstrumentRequest', 
          payload: instrument.id 
        });
  
        setTimeout(() => {
          dispatch({ type: 'instruments/fetchInstrumentsStart' });
        }, 1000);
        
      } catch (error) {
        console.error('Error in handleDeleteInstrument:', error);
        alert('Delete failed. Please check console for details.');
      } finally {
        setDeleteLoading(null);
        setShowActionsDropdown(null);
      }
    } else {
      setShowActionsDropdown(null);
    }
  };

  const handleAddInstrument = () => {
    setShowAddPopup(true);
  };

  const handleSyncUp = () => {
    setShowSyncPopup(true); 
  };

  const handleSaveInstrument = (updatedInstrument: Instrument) => {
    console.log('Instrument saved:', updatedInstrument);
  };

  const handleSaveNewInstrument = (instrument: Instrument) => {
    console.log('New instrument created:', instrument);
    setShowAddPopup(false); // Đóng popup sau khi tạo thành công
  };

  // 🔹 UI helper
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

  // Calculate calibration due count
  const calibrationDueCount = instruments.filter(i => i.calibrationDue).length;

  // 🔹 Loading state
  if (loading && instruments.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">{t("common.loading")}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("instrumentsPage.title")}</h1>
        <p className="text-gray-600">{t("instrumentsPage.subtitle")}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">{t("instrumentsPage.summaryCards.totalInstruments")}</div>
          <div className="text-xl font-semibold text-gray-900">{instruments.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">{t("instrumentsPage.summaryCards.active")}</div>
          <div className="text-xl font-semibold text-gray-900">
            {instruments.filter(i => i.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">{t("instrumentsPage.summaryCards.maintenance")}</div>
          <div className="text-xl font-semibold text-gray-900">
            {instruments.filter(i => i.status === 'Maintenance').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500 mb-1">{t("instrumentsPage.summaryCards.calibrationDue")}</div>
          <div className="text-xl font-semibold text-gray-900">
            {calibrationDueCount}
          </div>
        </div>
      </div>

      {/* All Instruments Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t("instrumentsPage.allInstruments.title")}</h2>
              <p className="text-gray-600 text-sm">{t("instrumentsPage.allInstruments.subtitle")}</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Sync-up Button */}
              <button
                onClick={handleSyncUp}
                disabled={loading}
                className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{loading ? t("instrumentsPage.filters.refreshing") : t("instrumentsPage.filters.syncInstruments")}</span>
              </button>

              {/* Add Instrument Button */}
              <button
                onClick={handleAddInstrument}
                className="flex items-center space-x-2 bg-blue-600 rounded-lg px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{t("instrumentsPage.filters.addInstrument")}</span>
              </button>

              {/* Search Input */}
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t("instrumentsPage.filters.searchPlaceholder")}
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
              {searchTerm ? t("instrumentsPage.table.noInstrumentsFound") : t("instrumentsPage.table.noInstrumentsAvailable")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstruments.map((instrument) => (
                <div key={instrument.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  {/* Instrument Header with dropdown menu */}
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
                        disabled={deleteLoading === instrument.id}
                        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === instrument.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                        ) : (
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Dropdown Menu */}
                      {showActionsDropdown === instrument.id && (
                        <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-2 w-48 z-10">
                          <button 
                            onClick={() => handleViewDetails(instrument)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {t("instrumentsPage.table.viewDetails")}
                          </button>
                          <button 
                            onClick={() => handleEditInstrument(instrument)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {t("instrumentsPage.table.editInstrument")}
                          </button>
                          <button 
                            onClick={() => handleDeleteInstrument(instrument)}
                            disabled={deleteLoading === instrument.id}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center space-x-2"
                          >
                            {deleteLoading === instrument.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                                <span>{t("instrumentsPage.table.deleting")}</span>
                              </>
                            ) : (
                              <span>{t("instrumentsPage.table.deleteInstrument")}</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Instrument Details */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-sm">{t("instrumentsPage.table.status")}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(instrument.status)}`}>
                        {instrument.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-sm">{t("instrumentsPage.table.serialNumber")}</span>
                      <span className="text-gray-900 text-sm font-medium text-right">{instrument.serialNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-sm">{t("instrumentsPage.table.location")}</span>
                      <span className="text-gray-900 text-sm font-medium text-right">{instrument.location}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-sm">{t("instrumentsPage.table.manufacturer")}</span>
                      <span className="text-gray-900 text-sm font-medium text-right">{instrument.manufacturer}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-sm">{t("instrumentsPage.table.nextCalibration")}</span>
                      <span className="text-gray-900 text-sm font-medium text-right">{instrument.nextCalibration}</span>
                    </div>
                  </div>

                  {/* Calibration Alert - only show when calibrationDue = true */}
                  {instrument.calibrationDue && (
                    <div className="bg-red-50 border border-red-200 rounded p-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 text-sm font-medium">{t("instrumentsPage.table.calibrationDueSoon")}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instrument Detail Popup */}
      {selectedInstrument && (
        <InstrumentDetailsPopup
          instrument={selectedInstrument}
          onClose={() => setSelectedInstrument(null)}
          onEdit={handleEditInstrument}
        />
      )}

      {/* Edit Instrument Popup */}
      {editingInstrument && (
        <EditInstrumentPopup
          instrument={editingInstrument}
          onClose={() => setEditingInstrument(null)}
          onSave={handleSaveInstrument}
        />
      )}

      {/* Add Instrument Popup - CHỈ HIỆN KHI showAddPopup = true */}
      {showAddPopup && (
        <AddInstrumentPopup
          onClose={() => setShowAddPopup(false)}
          onSave={handleSaveNewInstrument}
        />
      )}

        {/* Sync Instruments Popup */}
        {showSyncPopup && (
        <SyncInstrumentsPopup
          onClose={() => setShowSyncPopup(false)}
        />
      )}

    </div>
  );
};

export default InstrumentsPage;