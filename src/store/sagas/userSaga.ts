import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

// Mock API functions
const mockGetUsersAPI = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@lab.com",
      role: "technician",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@lab.com",
      role: "admin",
      status: "active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@lab.com",
      role: "supervisor",
      status: "inactive",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@lab.com",
      role: "technician",
      status: "active",
    },
  ];
};

const mockCreateUserAPI = async (userData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id: Date.now().toString(),
    ...userData,
    status: "active",
    createdAt: new Date().toISOString(),
  };
};

const mockUpdateUserAPI = async ({ id, ...userData }: any) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    id,
    ...userData,
    updatedAt: new Date().toISOString(),
  };
};

const mockDeleteUserAPI = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, id };
};

// Get Users Saga
function* getUsersSaga() {
  try {
    const users = yield call(mockGetUsersAPI);
    yield put({ type: "users/getUsersSuccess", payload: users });
  } catch (error: any) {
    yield put({ type: "users/getUsersFailure", payload: error.message });
  }
}

// Create User Saga
function* createUserSaga(action: PayloadAction<any>) {
  try {
    const newUser = yield call(mockCreateUserAPI, action.payload);
    yield put({ type: "users/createUserSuccess", payload: newUser });
  } catch (error: any) {
    yield put({ type: "users/createUserFailure", payload: error.message });
  }
}

// Update User Saga
function* updateUserSaga(action: PayloadAction<any>) {
  try {
    const updatedUser = yield call(mockUpdateUserAPI, action.payload);
    yield put({ type: "users/updateUserSuccess", payload: updatedUser });
  } catch (error: any) {
    yield put({ type: "users/updateUserFailure", payload: error.message });
  }
}

// Delete User Saga
function* deleteUserSaga(action: PayloadAction<string>) {
  try {
    const result = yield call(mockDeleteUserAPI, action.payload);
    yield put({ type: "users/deleteUserSuccess", payload: result.id });
  } catch (error: any) {
    yield put({ type: "users/deleteUserFailure", payload: error.message });
  }
}

export function* userSaga() {
  yield takeEvery("users/getUsersRequest", getUsersSaga);
  yield takeLatest("users/createUserRequest", createUserSaga);
  yield takeLatest("users/updateUserRequest", updateUserSaga);
  yield takeLatest("users/deleteUserRequest", deleteUserSaga);
}
