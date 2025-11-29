// API Endpoints
export const API_ENDPOINTS = {
    TEST_TYPES: 'https://69085724b49bea95fbf32f71.mockapi.io/test-type',
    REAGENTS: 'https://69085724b49bea95fbf32f71.mockapi.io/reagents',
  } as const;
  
  // Status Configuration
  export const STATUS_CONFIG = {
    ACTIVE: {
      value: 'Active' as const,
      color: 'bg-green-100 text-green-800',
      translationKey: 'common.active',
    },
    MAINTENANCE: {
      value: 'Maintenance' as const,
      color: 'bg-yellow-100 text-yellow-800',
      translationKey: 'modals.instrumentDetails.maintenance',
    },
    INACTIVE: {
      value: 'Inactive' as const,
      color: 'bg-gray-100 text-gray-800',
      translationKey: 'common.inactive',
    },
  } as const;
  
  // Calibration Configuration
  export const CALIBRATION_CONFIG = {
    WARNING_THRESHOLD: 7, // days
    STATUS: {
      ON_TRACK: {
        color: 'bg-green-100 text-green-800',
        translationKey: 'modals.instrumentDetails.onTrack',
      },
      DUE_SOON: {
        color: 'bg-red-100 text-red-800',
        translationKey: 'modals.instrumentDetails.dueSoon',
      },
    },
  } as const;
  
  // CSS Classes
  export const CLASS_NAMES = {
    MODAL: {
      OVERLAY: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
      CONTAINER: "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto",
      HEADER: "sticky top-0 bg-white z-10 flex justify-between items-start p-6 border-b rounded-t-lg",
      SECTION: "bg-gray-50 p-4 rounded-lg",
      FOOTER: "sticky bottom-0 bg-white z-10 flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg",
    },
    BUTTON: {
      PRIMARY: "px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors",
      SECONDARY: "px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
      CLOSE: "text-gray-400 hover:text-gray-600 transition-colors p-1",
    },
    GRID: {
      BASIC: "grid grid-cols-1 md:grid-cols-2 gap-4",
      CONFIG: "grid grid-cols-1 md:grid-cols-2 gap-6",
    },
    STATUS_BADGE: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
    ALERT: {
      CONTAINER: "border rounded-lg p-4 bg-red-50 border-red-200",
      ICON: "w-10 h-10 rounded-full flex items-center justify-center bg-red-100",
    },
    INFO_CARD: "bg-white border border-gray-200 rounded-lg p-3",
    REAGENT_LIST: "max-h-48 overflow-y-auto space-y-2",
  } as const;
  
  // Field Configuration
  export const FIELD_CONFIG = {
    BASIC_INFO: [
      { key: 'name', translationKey: 'modals.instrumentDetails.instrumentName' },
      { key: 'model', translationKey: 'modals.instrumentDetails.model' },
      { key: 'serialNumber', translationKey: 'modals.instrumentDetails.serialNumber' },
      { key: 'status', translationKey: 'modals.instrumentDetails.status', isStatus: true },
      { key: 'location', translationKey: 'modals.instrumentDetails.location' },
      { key: 'manufacturer', translationKey: 'modals.instrumentDetails.manufacturer' },
    ] as const,

    TECHNICAL_SPECS: [
        { key: 'temperature', translationKey: 'modals.instrumentDetails.temperature', unit: '°C' },
        { key: 'sampleVolume', translationKey: 'modals.instrumentDetails.sampleVolume', unit: 'μL' },
        { key: 'firmwareVersion', translationKey: 'modals.instrumentDetails.firmwareVersion' },
        { key: 'port', translationKey: 'modals.instrumentDetails.port' },
        { key: 'encryption', translationKey: 'modals.instrumentDetails.encryption' },
        { key: 'ipAddress', translationKey: 'modals.instrumentDetails.ipAddress' },
      ] as const,
  
    CALIBRATION_INFO: [
      { key: 'nextCalibration', translationKey: 'modals.instrumentDetails.nextCalibration', isDate: true },
      { key: 'calibrationStatus', translationKey: 'modals.instrumentDetails.calibrationStatus', isCustom: true },
    ] as const,
  } as const;

  