import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Instrument {
  id: string;
  name: string;
  model: string;
  status: string;
  serialNumber?: string;
  location?: string;
  manufacturer?: string;
  supportedTest?: string[];
  supportedReagents?: string[];
  created_at?: string;
  updated_at?: string;
  calibrationDue?: boolean;
}

interface InstrumentsState {
  instruments: Instrument[];
  loading: boolean;
  error?: string;
}

const initialState: InstrumentsState = {
  instruments: [],
  loading: false,
  error: undefined,
};

const instrumentsSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {
    // Fetch
    fetchInstrumentsRequest(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchInstrumentsSuccess(state, action: PayloadAction<Instrument[]>) {
      state.loading = false;
      state.instruments = action.payload;
    },
    fetchInstrumentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Add
    addInstrumentRequest(state, action: PayloadAction<Partial<Instrument>>) {
      state.loading = true;
      state.error = undefined;
    },
    addInstrumentSuccess(state, action: PayloadAction<Instrument>) {
      state.loading = false;
      state.instruments.push(action.payload);
    },
    addInstrumentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update - 🔹 THÊM CÁC ACTIONS NÀY
    updateInstrumentRequest(state, action: PayloadAction<Instrument>) {
      state.loading = true;
      state.error = undefined;
    },
    updateInstrumentSuccess(state, action: PayloadAction<Instrument>) {
      state.loading = false;
      const index = state.instruments.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.instruments[index] = action.payload;
      }
    },
    updateInstrumentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deleteInstrumentRequest(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = undefined;
    },
    deleteInstrumentSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.instruments = state.instruments.filter(i => i.id !== action.payload);
    },
    deleteInstrumentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear Error - 🔹 THÊM ACTION NÀY (TUỲ CHỌN)
    clearError(state) {
      state.error = undefined;
    },
  },
});

export const {
  fetchInstrumentsRequest,
  fetchInstrumentsSuccess,
  fetchInstrumentsFailure,
  addInstrumentRequest,
  addInstrumentSuccess,
  addInstrumentFailure,
  updateInstrumentRequest,    // 🔹 EXPORT UPDATE ACTIONS
  updateInstrumentSuccess,
  updateInstrumentFailure,
  deleteInstrumentRequest,
  deleteInstrumentSuccess,
  deleteInstrumentFailure,
  clearError,                // 🔹 EXPORT CLEAR ERROR
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;