import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ReagentServer = {
  id?: number;
  name: string;
  lot_number: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  usage_per_run?: number;
  expiry_date?: string;
  location?: string;
  min_stock?: number;
  max_stock?: number;
  cost?: number;
};

export type ReagentForm = {
  name: string;
  lotNumber: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  usagePerRun?: number;
  expiryDate?: string;
  location?: string;
  minStock?: number;
  maxStock?: number;
  cost?: number;
};

interface ReagentState {
  list: ReagentServer[];
  loading: boolean;
  error: string | null;
}

const initialState: ReagentState = {
  list: [],
  loading: false,
  error: null,
};

const reagentSlice = createSlice({
  name: "reagent",
  initialState,
  reducers: {
    // --- Fetch Reagents ---
    fetchReagentsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchReagentsSuccess(state, action: PayloadAction<ReagentServer[]>) {
      state.list = action.payload;
      state.loading = false;
    },
    fetchReagentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Add Reagent ---
    addReagentRequest(state, action: PayloadAction<ReagentForm>) {
      state.loading = true;
      state.error = null;
    },
    addReagentSuccess(state, action: PayloadAction<ReagentServer>) {
      state.list.unshift(action.payload);
      state.loading = false;
    },
    addReagentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Delete Reagent ---
    deleteReagentRequest(state, action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteReagentSuccess(state, action: PayloadAction<number>) {
      state.list = state.list.filter((r) => r.id !== action.payload);
      state.loading = false;
    },
    deleteReagentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchReagentsRequest,
  fetchReagentsSuccess,
  fetchReagentsFailure,
  addReagentRequest,
  addReagentSuccess,
  addReagentFailure,
  deleteReagentRequest,
  deleteReagentSuccess,
  deleteReagentFailure,
} = reagentSlice.actions;

export default reagentSlice.reducer;
