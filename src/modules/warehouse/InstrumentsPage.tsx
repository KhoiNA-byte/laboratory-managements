import React, { useState, useEffect } from 'react';
import { useInstruments } from '../../common/hooks';
import { StatusCardsGrid } from '../../components/Instruments/statusCard';
// import { Icon } from '../../components/Instruments/icon'; // 🔹 XÓA DÒNG NÀY
import InstrumentCard from '../../components/Instruments/InstrumentCard';
import InstrumentDetailsPopup from './InstrumentDetailPopup';
import EditInstrumentPopup from './EditInstrumentPage';
import AddInstrumentPopup from './AddInstrumentPage';
import SyncInstrumentsPopup from './SyncInstrumentsPopup';
import { CLASS_NAMES, UI_TEXT } from '../../constants/instruments/instruments';
import { Instrument } from '../../store/types';

const InstrumentsPage: React.FC = () => {
  const {
    instruments,
    loading,
    error,
    fetchInstruments,
    deleteInstrument,
    calibrationDueCount,
    activeCount,
    maintenanceCount,
    getStatusColor,
    getDeleteConfirmMessage,
  } = useInstruments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showSyncPopup, setShowSyncPopup] = useState(false);

  // 🔹 Fetch data from Redux Saga
  useEffect(() => {
    fetchInstruments();
  }, [fetchInstruments]);

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
    if (window.confirm(getDeleteConfirmMessage(instrument.name))) {
      try {
        setDeleteLoading(instrument.id);
        await deleteInstrument(instrument.id);
        
        setTimeout(() => {
          fetchInstruments();
        }, 1000);
        
      } catch (error) {
        console.error('Error in handleDeleteInstrument:', error);
        alert(UI_TEXT.MESSAGES.DELETE_FAILED);
      } finally {
        setDeleteLoading(null);
        setShowActionsDropdown(null);
      }
    } else {
      setShowActionsDropdown(null);
    }
  };

  const handleAddInstrument = () => setShowAddPopup(true);
  const handleSyncUp = () => setShowSyncPopup(true);

  const handleSaveInstrument = (updatedInstrument: Instrument) => {
    console.log('Instrument saved:', updatedInstrument);
    setEditingInstrument(null);
  };

  const handleSaveNewInstrument = (instrument: Instrument) => {
    console.log('New instrument created:', instrument);
    setShowAddPopup(false);
    setTimeout(() => {
      fetchInstruments();
    }, 500);
  };

  // 🔹 Loading state
  if (loading && instruments.length === 0) return (
    <div className={CLASS_NAMES.LAYOUT.LOADING}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">{UI_TEXT.MESSAGES.LOADING}</p>
      </div>
    </div>
  );

  return (
    <div className={CLASS_NAMES.LAYOUT.PAGE}>
      {/* Error Alert */}
      {error && (
        <div className={CLASS_NAMES.COMPONENTS.ALERT.ERROR}>
          <div className="flex items-center">
            {/* 🔹 GIỮ NGUYÊN ICON CŨ */}
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{UI_TEXT.HEADER.TITLE}</h1>
        <p className="text-gray-600">{UI_TEXT.HEADER.SUBTITLE}</p>
      </div>

      {/* Status Cards */}
      <StatusCardsGrid
        total={instruments.length}
        active={activeCount}
        maintenance={maintenanceCount}
        calibrationDue={calibrationDueCount}
      />

      {/* All Instruments Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{UI_TEXT.SECTIONS.ALL_INSTRUMENTS}</h2>
              <p className="text-gray-600 text-sm">{UI_TEXT.SECTIONS.ALL_INSTRUMENTS_SUBTITLE}</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Sync-up Button */}
              <button
                onClick={handleSyncUp}
                disabled={loading}
                className={CLASS_NAMES.BUTTONS.SYNC}
              >
                {/* 🔹 GIỮ NGUYÊN ICON CŨ */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{loading ? UI_TEXT.BUTTONS.REFRESHING : UI_TEXT.BUTTONS.SYNC_UP}</span>
              </button>

              {/* Add Instrument Button */}
              <button
                onClick={handleAddInstrument}
                className={CLASS_NAMES.BUTTONS.ADD}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{UI_TEXT.BUTTONS.ADD_INSTRUMENT}</span>
              </button>

              {/* Search Input */}
              <div className="relative">
                {/* 🔹 GIỮ NGUYÊN ICON CŨ */}
                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={UI_TEXT.BUTTONS.SEARCH_PLACEHOLDER}
                  className={CLASS_NAMES.COMPONENTS.SEARCH_INPUT}
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
              {searchTerm ? UI_TEXT.MESSAGES.NO_RESULTS : UI_TEXT.MESSAGES.NO_INSTRUMENTS}
            </div>
          ) : (
            <div className={CLASS_NAMES.LAYOUT.INSTRUMENT_GRID}>
              {filteredInstruments.map((instrument) => (
                <InstrumentCard
                  key={instrument.id}
                  instrument={instrument}
                  showActionsDropdown={showActionsDropdown}
                  deleteLoading={deleteLoading}
                  onToggleDropdown={setShowActionsDropdown}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditInstrument}
                  onDelete={handleDeleteInstrument}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      {selectedInstrument && (
        <InstrumentDetailsPopup
          instrument={selectedInstrument}
          onClose={() => setSelectedInstrument(null)}
          onEdit={handleEditInstrument}
        />
      )}

      {editingInstrument && (
        <EditInstrumentPopup
          instrument={editingInstrument}
          onClose={() => setEditingInstrument(null)}
          onSave={handleSaveInstrument}
        />
      )}

      {showAddPopup && (
        <AddInstrumentPopup
          onClose={() => setShowAddPopup(false)}
          onSave={handleSaveNewInstrument}
        />
      )}

      {showSyncPopup && (
        <SyncInstrumentsPopup onClose={() => setShowSyncPopup(false)} />
      )}
    </div>
  );
};

export default InstrumentsPage;