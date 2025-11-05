import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  setRedirectPath,
} from "../slices/authSlice";
import { mockLoginAPI, mockLogoutAPI } from "../apis/mock/authMock";

/**
 * LOGIN SAGA
 */
function* loginSaga(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(mockLoginAPI, { email, password });

    // Store token + user in localStorage
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    // Dispatch success action
    yield put(
      loginSuccess({
        user: response.user,
        token: response.token,
      })
    );

    // Handle redirect based on role
    switch (response.user.role) {
      case "admin":
      case "manager":
      case "lab_user":
      case "service":
        yield put(setRedirectPath("/admin/dashboard"));
        break;
      case "user":
        yield put(setRedirectPath("/admin/profile"));
        break;
      default:
        yield put(setRedirectPath("/home"));
        break;
    }
  } catch (error) {
    yield put(loginFailure(error.message || "Login failed"));
  }
}

/**
 * LOGOUT SAGA
 */
function* logoutSaga() {
  try {
    yield call(mockLogoutAPI);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(error.message || "Logout failed"));
  }
}

/**
 * CHECK AUTH STATUS SAGA
 * (Called on app init to restore session)
 */
function* checkAuthStatusSaga() {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      const user = JSON.parse(userStr);
      yield put(loginSuccess({ user, token }));
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

/**
 * ROOT AUTH SAGA
 */
export function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeEvery("auth/checkAuthStatus", checkAuthStatusSaga);
}
