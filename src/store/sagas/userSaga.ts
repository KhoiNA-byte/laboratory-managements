import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  getUsersAPI,
  createUserAPI,
  updateUserAPI,
  User,
} from "../../services/userApi";

// Get Users Saga
function* getUsersSaga() {
  try {
    const users: User[] = yield call(getUsersAPI);
    yield put({
      type: "users/getUsersSuccess",
      payload: users,
    });
  } catch (error: any) {
    yield put({
      type: "users/getUsersFailure",
      payload: error.message || "Failed to fetch users",
    });
  }
}

// Create User Saga
function* createUserSaga(action: PayloadAction<any>): Generator {
  try {
    const currentDate = new Date().toISOString();

    const newUserData = {
      ...action.payload,
      status: "active",
      lastLogin: currentDate.split("T")[0],
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    // Send all data including id
    const newUser: User = yield call(createUserAPI, newUserData);

    yield put({
      type: "users/createUserSuccess",
      payload: newUser,
    });
  } catch (error: any) {
    yield put({
      type: "users/createUserFailure",
      payload: error.message || "Failed to create user",
    });
  }
}

// Update User Saga
function* updateUserSaga(action: PayloadAction<any>): Generator {
  try {
    const updatedUser: User = yield call(updateUserAPI, action.payload);
    yield put({
      type: "users/updateUserSuccess",
      payload: updatedUser,
    });
  } catch (error: any) {
    yield put({
      type: "users/updateUserFailure",
      payload: error.message || "Failed to update user",
    });
  }
}

export function* userSaga() {
  yield takeEvery("users/getUsersRequest", getUsersSaga);
  yield takeLatest("users/createUserRequest", createUserSaga);
  yield takeLatest("users/updateUserRequest", updateUserSaga);
}
