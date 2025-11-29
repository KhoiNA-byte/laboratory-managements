// API Endpoints
export const API_ENDPOINTS = {
    TEST_TYPES: 'https://69085724b49bea95fbf32f71.mockapi.io/test_type',
    REAGENTS: 'https://69085724b49bea95fbf32f71.mockapi.io/reagents',
  } as const;
  
  // Form Configuration
  export const FORM_CONFIG = {
    STATUS_OPTIONS: [
      { value: 'Active', label: 'common.active' },
      { value: 'Maintenance', label: 'common.maintenance' },
      { value: 'Inactive', label: 'common.inactive' },
    ] as const,
  
    LOCATION_OPTIONS: [
      'L-001', 'L-002', 'L-003', 'L-004', 
      'L-005', 'L-006', 'L-007', 'L-008', 'L-009'
    ] as const,
  
    VALIDATION_RULES: {
      MIN_NAME_LENGTH: 2,
      SPECIAL_CHAR_REGEX: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
    } as const,
  
    LOADING_STATES: {
      TEST_TYPES: 'testTypes',
      REAGENTS: 'reagents',
    } as const,
  } as const;
  
  // Field Configuration
  export const FIELD_CONFIG = {
    BASIC_FIELDS: [
      {
        name: 'name' as const,
        label: 'modals.addInstrument.instrumentName',
        type: 'text' as const,
        required: true,
        placeholder: 'modals.addInstrument.placeholders.instrumentName',
      },
      {
        name: 'model' as const,
        label: 'modals.addInstrument.model',
        type: 'text' as const,
        required: true,
        placeholder: 'modals.addInstrument.placeholders.model',
      },
      {
        name: 'serialNumber' as const,
        label: 'modals.addInstrument.serialNumber',
        type: 'text' as const,
        required: true,
        placeholder: 'modals.addInstrument.placeholders.serialNumber',
      },
      {
        name: 'manufacturer' as const,
        label: 'modals.addInstrument.manufacturer',
        type: 'text' as const,
        required: true,
        placeholder: 'modals.addInstrument.placeholders.manufacturer',
      },
    ] as const,
  
    DROPDOWN_FIELDS: [
      {
        name: 'status' as const,
        label: 'modals.addInstrument.status',
        type: 'select' as const,
        required: true,
        options: 'STATUS_OPTIONS' as const,
      },
      {
        name: 'location' as const,
        label: 'modals.addInstrument.location',
        type: 'select' as const,
        required: true,
        options: 'LOCATION_OPTIONS' as const,
        placeholder: 'modals.addInstrument.selectLocation',
      },
    ] as const,
  } as const;
  
  // Initial Form State
  export const INITIAL_FORM_DATA = {
    name: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    status: "Active" as const,
    location: "",
    nextCalibration: "",
    supportedTest: "",
    supportedReagents: [] as string[],
  } as const;
  
  // CSS Classes
  export const CLASS_NAMES = {
    MODAL: {
      OVERLAY: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
      CONTAINER: "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto",
      HEADER: "flex justify-between items-start p-6 border-b",
      SECTION: "bg-gray-50 p-4 rounded-lg",
      FOOTER: "flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg",
    },
    INPUT: {
      BASE: "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      VALID: "border-gray-300",
      INVALID: "border-red-500",
      DISABLED: "opacity-50 cursor-not-allowed",
    },
    BUTTON: {
      PRIMARY: "px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2",
      SECONDARY: "px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50",
      CLOSE: "text-gray-400 hover:text-gray-600 transition-colors p-1",
    },
    GRID: {
      BASIC: "grid grid-cols-1 md:grid-cols-2 gap-4",
      CONFIG: "grid grid-cols-1 md:grid-cols-2 gap-6",
    },
  } as const;

  // Edit Instrument Specific Configuration
export const EDIT_INSTRUMENT_CONFIG = {
    TITLE: 'modals.editInstrument.title',
    SUBTITLE: 'modals.editInstrument.subtitle',
    SAVE_BUTTON: 'modals.editInstrument.saveChanges',
    SAVING_TEXT: 'modals.editInstrument.saving',
    ERROR_SAVING: 'modals.editInstrument.errorSaving',
  } as const;
  
  // Combined Form Config for both Add and Edit
  export const getFormConfig = (isEdit: boolean = false) => ({
    TITLE: isEdit ? EDIT_INSTRUMENT_CONFIG.TITLE : 'modals.addInstrument.title',
    SUBTITLE: isEdit ? EDIT_INSTRUMENT_CONFIG.SUBTITLE : 'modals.addInstrument.subtitle',
    SAVE_BUTTON: isEdit ? EDIT_INSTRUMENT_CONFIG.SAVE_BUTTON : 'modals.addInstrument.createInstrument',
    SAVING_TEXT: isEdit ? EDIT_INSTRUMENT_CONFIG.SAVING_TEXT : 'modals.addInstrument.creating',
  });