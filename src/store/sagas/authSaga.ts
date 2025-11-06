// sagas/authSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { loginAPI, logoutAPI } from "../../services/authApi";
import { getRolesAPI } from "../../services/roleApi";
import {
  loginSuccess,
  loginFailure,
  logoutSuccess,
} from "../../store/slices/authSlice";

// Define the login response type based on your API
interface LoginResponse {
  user: any;
  token: string;
}

function* loginSaga(
  action: PayloadAction<{ email: string; password: string }>
) {
  try {
    console.log("🔄 authSaga: Starting login process");

    // Call login API
    const loginResponse: LoginResponse = yield call(loginAPI, action.payload);
    console.log("✅ authSaga: Login API success", loginResponse.user);

    // Fetch roles to get permissions for the user's role
    console.log("📡 authSaga: Fetching roles for permissions");
    const roles = yield call(getRolesAPI);
    const userRole = roles.find(
      (role: any) => role.roleCode === loginResponse.user.role
    );
    const userPermissions = userRole?.permission || [];

    console.log("🔑 authSaga: User permissions:", userPermissions);

    // Dispatch success with user, token, and permissions
    yield put(
      loginSuccess({
        user: loginResponse.user,
        token: loginResponse.token,
        permissions: userPermissions,
      })
    );

    console.log("🎯 authSaga: Login success dispatched");
  } catch (error: any) {
    console.error("❌ authSaga: Login failed:", error);
    yield put(loginFailure(error.message || "Login failed"));
  }
}

// Logout saga (if you need it)
function* logoutSaga() {
  try {
    // You can add API call for logout here if needed
    console.log("🔄 authSaga: Logging out");
    // yield call(logoutAPI); // Uncomment if you have logout API

    // Clear local storage or tokens if needed
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error: any) {
    console.error("❌ authSaga: Logout failed:", error);
    // Even if logout API fails, we should clear local state
  } finally {
    // Always dispatch logout success to clear local state
    yield put(logoutSuccess());
  }
}

export function* authSaga() {
  yield takeLatest("auth/loginRequest", loginSaga);
  yield takeLatest("auth/logoutRequest", logoutSaga);
}
