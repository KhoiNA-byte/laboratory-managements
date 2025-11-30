// patientSaga.ts
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  getPatientsAPI,
  createPatientAPI,
  updatePatientAPI,
  deletePatientAPI,
  Patient,
} from "../../services/patientApi";

// 🟢 Get Patients Saga
function* getPatientsSaga() {
  try {
    const patients: Patient[] = yield call(getPatientsAPI);

    yield put({
      type: "patients/getPatientsSuccess",
      payload: patients,
    });
  } catch (error: any) {
    yield put({
      type: "patients/getPatientsFailure",
      payload: error.message || "Failed to fetch patients",
    });
  }
}

// 🟢 Create Patient Saga
function* createPatientSaga(action: PayloadAction<any>): Generator {
  try {
    const currentDate = new Date().toISOString();

    const newPatientData = {
      ...action.payload,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const newPatient: Patient = yield call(createPatientAPI, newPatientData);

    yield put({
      type: "patients/createPatientSuccess",
      payload: newPatient,
    });
  } catch (error: any) {
    yield put({
      type: "patients/createPatientFailure",
      payload: error.message || "Failed to create patient",
    });
  }
}

// 🟢 Update Patient Saga
function* updatePatientSaga(action: PayloadAction<any>): Generator {
  try {
    const updatedPatient: Patient = yield call(
      updatePatientAPI,
      action.payload
    );

    yield put({
      type: "patients/updatePatientSuccess",
      payload: updatedPatient,
    });
  } catch (error: any) {
    yield put({
      type: "patients/updatePatientFailure",

      payload: error.message || "Failed to update patient",
    });
  }
}

// 🟠 Delete Patient Saga
function* deletePatientSaga(action: PayloadAction<string>): Generator {
  try {
    yield call(deletePatientAPI, action.payload);
    yield put({
      type: "patients/deletePatientSuccess",
      payload: action.payload, // ID của bệnh nhân đã xóa
    });
  } catch (error: any) {
    yield put({
      type: "patients/deletePatientFailure",
      payload: error.message || "Failed to delete patient",
    });
  }
}

// 🧩 Root Saga cho bệnh nhân
export function* patientSaga() {
  yield takeEvery("patients/getPatientsRequest", getPatientsSaga);
  yield takeLatest("patients/createPatientRequest", createPatientSaga);
  yield takeLatest("patients/updatePatientRequest", updatePatientSaga);
  yield takeLatest("patients/deletePatientRequest", deletePatientSaga);
}
