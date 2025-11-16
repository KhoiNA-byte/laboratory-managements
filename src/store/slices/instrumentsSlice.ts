// src/store/slices/instrumentsSlice.ts
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
  },
});

export const {
  fetchInstrumentsRequest,
  fetchInstrumentsSuccess,
  fetchInstrumentsFailure,
  addInstrumentRequest,
  addInstrumentSuccess,
  addInstrumentFailure,
  deleteInstrumentRequest,
  deleteInstrumentSuccess,
  deleteInstrumentFailure,
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
