// import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
// import { PayloadAction } from '@reduxjs/toolkit'

// // Mock API functions
// const mockGetPatientsAPI = async () => {
//     await new Promise(resolve => setTimeout(resolve, 1000))
//     return [
//         {
//             id: '1',
//             name: 'John Doe',
//             age: 45,
//             gender: 'Male',
//             phone: '+1234567890',
//             email: 'john.doe@email.com',
//             address: '123 Main St, City',
//             medicalRecord: 'MR001',
//             lastVisit: '2024-01-15',
//             status: 'active'
//         },
//         {
//             id: '2',
//             name: 'Jane Smith',
//             age: 32,
//             gender: 'Female',
//             phone: '+1234567891',
//             email: 'jane.smith@email.com',
//             address: '456 Oak Ave, City',
//             medicalRecord: 'MR002',
//             lastVisit: '2024-01-10',
//             status: 'active'
//         },
//         {
//             id: '3',
//             name: 'Bob Johnson',
//             age: 58,
//             gender: 'Male',
//             phone: '+1234567892',
//             email: 'bob.johnson@email.com',
//             address: '789 Pine Rd, City',
//             medicalRecord: 'MR003',
//             lastVisit: '2024-01-05',
//             status: 'inactive'
//         },
//     ]
// }

// const mockCreatePatientAPI = async (patientData: any) => {
//     await new Promise(resolve => setTimeout(resolve, 1200))
//     return {
//         id: Date.now().toString(),
//         ...patientData,
//         medicalRecord: `MR${Date.now()}`,
//         status: 'active',
//         createdAt: new Date().toISOString()
//     }
// }

// const mockUpdatePatientAPI = async ({ id, ...patientData }: any) => {
//     await new Promise(resolve => setTimeout(resolve, 900))
//     return {
//         id,
//         ...patientData,
//         updatedAt: new Date().toISOString()
//     }
// }

// const mockDeletePatientAPI = async (id: string) => {
//     await new Promise(resolve => setTimeout(resolve, 700))
//     return { success: true, id }
// }

// // Get Patients Saga
// function* getPatientsSaga() {
//     try {
//         const patients = yield call(mockGetPatientsAPI)
//         yield put({ type: 'patients/getPatientsSuccess', payload: patients })
//     } catch (error: any) {
//         yield put({ type: 'patients/getPatientsFailure', payload: error.message })
//     }
// }

// // Create Patient Saga
// function* createPatientSaga(action: PayloadAction<any>) {
//     try {
//         const newPatient = yield call(mockCreatePatientAPI, action.payload)
//         yield put({ type: 'patients/createPatientSuccess', payload: newPatient })
//     } catch (error: any) {
//         yield put({ type: 'patients/createPatientFailure', payload: error.message })
//     }
// }

// // Update Patient Saga
// function* updatePatientSaga(action: PayloadAction<any>) {
//     try {
//         const updatedPatient = yield call(mockUpdatePatientAPI, action.payload)
//         yield put({ type: 'patients/updatePatientSuccess', payload: updatedPatient })
//     } catch (error: any) {
//         yield put({ type: 'patients/updatePatientFailure', payload: error.message })
//     }
// }

// // Delete Patient Saga
// function* deletePatientSaga(action: PayloadAction<string>) {
//     try {
//         const result = yield call(mockDeletePatientAPI, action.payload)
//         yield put({ type: 'patients/deletePatientSuccess', payload: result.id })
//     } catch (error: any) {
//         yield put({ type: 'patients/deletePatientFailure', payload: error.message })
//     }
// }

// export function* patientSaga() {
//     yield takeEvery('patients/getPatientsRequest', getPatientsSaga)
//     yield takeLatest('patients/createPatientRequest', createPatientSaga)
//     yield takeLatest('patients/updatePatientRequest', updatePatientSaga)
//     yield takeLatest('patients/deletePatientRequest', deletePatientSaga)
// }


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
    const updatedPatient: Patient = yield call(updatePatientAPI, action.payload);
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
