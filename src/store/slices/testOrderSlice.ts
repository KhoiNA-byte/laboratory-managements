import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TestOrder, TestResult } from "../types";

interface TestOrderState {
  testOrders: TestOrder[];
  testResults: TestResult[];
  loading: boolean;
  error: string | null;
}

const initialState: TestOrderState = {
  testOrders: [],
  testResults: [],
  loading: false,
  error: null,
};

const testOrderSlice = createSlice({
  name: "testOrders",
  initialState,
  reducers: {
    fetchTestOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTestOrdersSuccess: (state, action: PayloadAction<TestOrder[]>) => {
      state.loading = false;
      state.testOrders = action.payload;
      state.error = null;
    },
    fetchTestOrdersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTestOrder: (state, action: PayloadAction<TestOrder>) => {
      state.testOrders.push(action.payload);
    },
    updateTestOrder: (state, action: PayloadAction<TestOrder>) => {
      const index = state.testOrders.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.testOrders[index] = action.payload;
      }
    },
    deleteTestOrder: (state, action: PayloadAction<string>) => {
      state.testOrders = state.testOrders.filter(
        (order) => order.id !== action.payload
      );
    },
    fetchTestResultsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTestResultsSuccess: (state, action: PayloadAction<TestResult[]>) => {
      state.loading = false;
      state.testResults = action.payload;
      state.error = null;
    },
    fetchTestResultsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTestResult: (state, action: PayloadAction<TestResult>) => {
      state.testResults.push(action.payload);
    },
    updateTestResult: (state, action: PayloadAction<TestResult>) => {
      const index = state.testResults.findIndex(
        (result) => result.id === action.payload.id
      );
      if (index !== -1) {
        state.testResults[index] = action.payload;
      }
    },
    deleteTestResult: (state, action: PayloadAction<string>) => {
      state.testResults = state.testResults.filter(
        (result) => result.id !== action.payload
      );
    },
  },
});

export const {
  fetchTestOrdersStart,
  fetchTestOrdersSuccess,
  fetchTestOrdersFailure,
  addTestOrder,
  updateTestOrder,
  deleteTestOrder,
  fetchTestResultsStart,
  fetchTestResultsSuccess,
  fetchTestResultsFailure,
  addTestResult,
  updateTestResult,
  deleteTestResult,
} = testOrderSlice.actions;
export default testOrderSlice.reducer;
