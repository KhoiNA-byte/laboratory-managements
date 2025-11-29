// Action Types
export const ACTION_TYPES = {
    // Fetch
    FETCH_INSTRUMENTS_REQUEST: 'instruments/fetchInstrumentsRequest',
    FETCH_INSTRUMENTS_SUCCESS: 'instruments/fetchInstrumentsSuccess', 
    FETCH_INSTRUMENTS_FAILURE: 'instruments/fetchInstrumentsFailure',
    
    // Add
    ADD_INSTRUMENT_REQUEST: 'instruments/addInstrumentRequest',
    ADD_INSTRUMENT_SUCCESS: 'instruments/addInstrumentSuccess',
    ADD_INSTRUMENT_FAILURE: 'instruments/addInstrumentFailure',
    
    // Delete
    DELETE_INSTRUMENT_REQUEST: 'instruments/deleteInstrumentRequest',
    DELETE_INSTRUMENT_SUCCESS: 'instruments/deleteInstrumentSuccess',
    DELETE_INSTRUMENT_FAILURE: 'instruments/deleteInstrumentFailure',
    
    // Update (nếu có)
    UPDATE_INSTRUMENT_REQUEST: 'instruments/updateInstrumentRequest',
    UPDATE_INSTRUMENT_SUCCESS: 'instruments/updateInstrumentSuccess',
    UPDATE_INSTRUMENT_FAILURE: 'instruments/updateInstrumentFailure',
  } as const;
  
  export { 
    fetchInstrumentsRequest,
    fetchInstrumentsSuccess,
    fetchInstrumentsFailure,
    addInstrumentRequest,
    addInstrumentSuccess,
    addInstrumentFailure,

  updateInstrumentRequest,
  updateInstrumentSuccess,
  updateInstrumentFailure,
    deleteInstrumentRequest,
    deleteInstrumentSuccess,
    deleteInstrumentFailure,
  } from '../../store/slices/instrumentsSlice';
  
  // Status Options
  export const INSTRUMENT_STATUS = {
    ACTIVE: 'Active',
    MAINTENANCE: 'Maintenance',
    INACTIVE: 'Inactive',
  } as const;
  
  export type InstrumentStatus = typeof INSTRUMENT_STATUS[keyof typeof INSTRUMENT_STATUS];
  
  // Status Colors Mapping
  export const STATUS_COLORS = {
    [INSTRUMENT_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
    [INSTRUMENT_STATUS.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
    [INSTRUMENT_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
  } as const;
  
  // UI Texts
  export const UI_TEXT = {
    HEADER: {
      TITLE: 'Instruments',
      SUBTITLE: 'Manage laboratory instruments and equipment',
    },
    BUTTONS: {
      SYNC_UP: 'Sync-up',
      ADD_INSTRUMENT: 'Add Instrument',
      REFRESHING: 'Refreshing...',
      SEARCH_PLACEHOLDER: 'Search instruments...',
    },
    STATUS_CARDS: {
      TOTAL: 'Total Instruments',
      ACTIVE: 'Active',
      MAINTENANCE: 'Maintenance',
      CALIBRATION_DUE: 'Calibration Due',
    },
    SECTIONS: {
      ALL_INSTRUMENTS: 'All Instruments',
      ALL_INSTRUMENTS_SUBTITLE: 'View and manage laboratory equipment',
    },
    MESSAGES: {
      NO_INSTRUMENTS: 'No instruments available',
      NO_RESULTS: 'No instruments found',
      LOADING: 'Loading instruments...',
      DELETE_CONFIRM: (name: string) => `Are you sure you want to delete "${name}"?`,
      DELETE_FAILED: 'Delete failed. Please check console for details.',
      CALIBRATION_DUE: 'Calibration due soon',
    },
    DROPDOWN_ACTIONS: {
      VIEW_DETAILS: 'View Details',
      EDIT_INSTRUMENT: 'Edit Instrument',
      DELETE_INSTRUMENT: 'Delete Instrument',
      DELETING: 'Deleting...',
    },
    VALIDATION: {
      NAME_REQUIRED: 'Tên thiết bị không được để trống',
    },
  } as const;
  
  // Icons (SVG Paths)
  export const ICONS = {
    SEARCH: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    SYNC: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    PLUS: "M12 4v16m8-8H4",
    ELLIPSIS: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z",
    WARNING: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    ERROR: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  } as const;
  
  // Class Names
  export const CLASS_NAMES = {
    LAYOUT: {
      PAGE: "min-h-screen bg-gray-50 p-6",
      LOADING: "min-h-screen bg-gray-50 flex items-center justify-center",
      CARD_GRID: "grid grid-cols-4 gap-4 mb-8",
      INSTRUMENT_GRID: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    },
    COMPONENTS: {
      STATUS_CARD: "bg-white rounded-lg p-4 shadow-sm border",
      INSTRUMENT_CARD: "border rounded-lg p-4 hover:shadow-md transition-shadow",
      SEARCH_INPUT: "border rounded-lg pl-10 pr-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
      DROPDOWN_MENU: "absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-2 w-48 z-10",
      ALERT: {
        ERROR: "mb-6 bg-red-50 border border-red-200 rounded-lg p-4",
        CALIBRATION: "bg-red-50 border border-red-200 rounded p-2",
      },
    },
    BUTTONS: {
      SYNC: "flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50",
      ADD: "flex items-center space-x-2 bg-blue-600 rounded-lg px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors",
      DROPDOWN: "p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50",
      DROPDOWN_ITEM: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors",
      DELETE: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center space-x-2",
    },
  } as const;

