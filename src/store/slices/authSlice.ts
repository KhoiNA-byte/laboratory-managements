// slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  gender?: string;
  age?: number;
  address?: string;
  status?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  identifyNumber?: string;
  dateOfBirth?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  token: string | null;
  loading: boolean;
  error: string | null;
  redirectPath: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  permissions: [],
  token: null,
  loading: false,
  error: null,
  redirectPath: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Saga action creators
    loginRequest: (
      state,
      action: PayloadAction<{
        email: string;
        password: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        permissions: string[]; // Add permissions here
      }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.permissions = action.payload.permissions; // Set permissions
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.permissions = []; // Clear permissions on failure
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.permissions = []; // Clear permissions on logout
      state.error = null;
      state.redirectPath = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRedirectPath: (state, action: PayloadAction<string>) => {
      state.redirectPath = action.payload;
    },
    // Add this to update permissions if needed elsewhere
    updatePermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  clearError,
  setRedirectPath,
  updatePermissions,
} = authSlice.actions;
export default authSlice.reducer;
