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
import { loginAPI, logoutAPI } from "../../services/authApi";

// Define USERS_ENDPOINT here for the checkAuthStatusSaga
const API_BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL;
const USERS_ENDPOINT = `${API_BASE_URL}${
  import.meta.env.VITE_MOCKAPI_USERS_ENDPOINT
}`;

/**
 * LOGIN SAGA - Using MockAPI.io
 */
function* loginSaga(
  action: PayloadAction<{ email: string; password: string }>
): Generator<any, void, any> {
  try {
    const { email, password } = action.payload;

    // Call MockAPI.io for authentication
    const response = yield call(loginAPI, { email, password });

    console.log("Login response from MockAPI:", response);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    yield put(setRedirectPath(response.redirectPath));

    yield put(
      loginSuccess({
        user: response.user,
        token: response.token,
      })
    );
  } catch (error: any) {
    yield put(loginFailure(error.message || "Login failed"));
  }
}

/**
 * LOGOUT SAGA
 */
function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(logoutAPI);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(logoutFailure(error.message || "Logout failed"));
  }
}

/**
 * CHECK AUTH STATUS SAGA
 */
function* checkAuthStatusSaga(): Generator<any, void, any> {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      const user = JSON.parse(userStr);

      // Simple existence check
      try {
        const response: Response = yield call(
          fetch,
          `${USERS_ENDPOINT}/${user.id}`
        );

        if (response.ok) {
          yield put(loginSuccess({ user, token }));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        // If check fails, still restore session for better UX
        yield put(loginSuccess({ user, token }));
      }
    }
  } catch (error) {
    console.error("Auth status check failed:", error);
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
