// sagas/roleSaga.ts
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  getRolesAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  Role,
} from "../../services/roleApi";

// Get Roles Saga
function* getRolesSaga() {
  try {
    const roles: Role[] = yield call(getRolesAPI);
    yield put({
      type: "roles/getRolesSuccess",
      payload: roles,
    });
  } catch (error: any) {
    yield put({
      type: "roles/getRolesFailure",
      payload: error.message || "Failed to fetch roles",
    });
  }
}

// Create Role Saga
function* createRoleSaga(action: PayloadAction<any>): Generator {
  try {
    const currentDate = new Date().toISOString();

    const newRoleData = {
      ...action.payload,
      status: "active",
      userCount: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const newRole: Role = yield call(createRoleAPI, newRoleData);

    yield put({
      type: "roles/createRoleSuccess",
      payload: newRole,
    });
  } catch (error: any) {
    yield put({
      type: "roles/createRoleFailure",
      payload: error.message || "Failed to create role",
    });
  }
}

// Update Role Saga
function* updateRoleSaga(action: PayloadAction<any>): Generator {
  try {
    const updatedRole: Role = yield call(updateRoleAPI, action.payload);
    yield put({
      type: "roles/updateRoleSuccess",
      payload: updatedRole,
    });
  } catch (error: any) {
    yield put({
      type: "roles/updateRoleFailure",
      payload: error.message || "Failed to update role",
    });
  }
}

// Delete Role Saga - now takes roleCode instead of id
function* deleteRoleSaga(action: PayloadAction<string>): Generator {
  try {
    yield call(deleteRoleAPI, action.payload); // action.payload is now roleCode
    yield put({
      type: "roles/deleteRoleSuccess",
      payload: action.payload, // This is the roleCode
    });
  } catch (error: any) {
    yield put({
      type: "roles/deleteRoleFailure",
      payload: error.message || "Failed to delete role",
    });
  }
}

export function* roleSaga() {
  yield takeEvery("roles/getRolesRequest", getRolesSaga);
  yield takeLatest("roles/createRoleRequest", createRoleSaga);
  yield takeLatest("roles/updateRoleRequest", updateRoleSaga);
  yield takeLatest("roles/deleteRoleRequest", deleteRoleSaga);
}
