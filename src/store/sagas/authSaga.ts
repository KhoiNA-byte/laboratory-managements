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
  redirectPath: string;
}

function* loginSaga(
  action: PayloadAction<{ email: string; password: string }>
) {
  try {
    // Call login API
    const loginResponse: LoginResponse = yield call(loginAPI, action.payload);
    console.log("Login Response in Saga:", loginResponse);
    const roles = yield call(getRolesAPI);
    const userRole = roles.find(
      (role: any) => role.roleCode === loginResponse.user.role
    );
    const userPermissions = userRole?.permission || [];

    // Dispatch success with user, token, and permissions
    yield put(
      loginSuccess({
        user: loginResponse.user,
        token: loginResponse.token,
        permissions: userPermissions,
        redirectPath: loginResponse.redirectPath,
      })
    );
  } catch (error: any) {
    yield put(loginFailure(error.message || "Login failed"));
  }
}

function* logoutSaga() {
  try {
    // Clear local storage or tokens if needed
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error: any) {
  } finally {
    // Always dispatch logout success to clear local state
    yield put(logoutSuccess());
  }
}

export function* authSaga() {
  yield takeLatest("auth/loginRequest", loginSaga);
  yield takeLatest("auth/logoutRequest", logoutSaga);
}
