// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Patient } from '../types'

// interface PatientState {
//     patients: Patient[]
//     loading: boolean
//     error: string | null
// }

// const initialState: PatientState = {
//     patients: [],
//     loading: false,
//     error: null,
// }

// const patientSlice = createSlice({
//     name: 'patients',
//     initialState,
//     reducers: {
//         fetchPatientsStart: (state) => {
//             state.loading = true
//             state.error = null
//         },
//         fetchPatientsSuccess: (state, action: PayloadAction<Patient[]>) => {
//             state.loading = false
//             state.patients = action.payload
//             state.error = null
//         },
//         fetchPatientsFailure: (state, action: PayloadAction<string>) => {
//             state.loading = false
//             state.error = action.payload
//         },
//         addPatient: (state, action: PayloadAction<Patient>) => {
//             state.patients.push(action.payload)
//         },
//         updatePatient: (state, action: PayloadAction<Patient>) => {
//             const index = state.patients.findIndex(patient => patient.id === action.payload.id)
//             if (index !== -1) {
//                 state.patients[index] = action.payload
//             }
//         },
//         deletePatient: (state, action: PayloadAction<string>) => {
//             state.patients = state.patients.filter(patient => patient.id !== action.payload)
//         },
//     },
// })

// export const {
//     fetchPatientsStart,
//     fetchPatientsSuccess,
//     fetchPatientsFailure,
//     addPatient,
//     updatePatient,
//     deletePatient,
// } = patientSlice.actions
// export default patientSlice.reducer


// patientSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Patient } from "../../services/patientApi";

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  successMessage: string | null;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  successMessage: null,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    // 🧹 Clear messages
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },

    clearCreateSuccess: (state) => {
      state.createSuccess = false;
      state.successMessage = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
      state.successMessage = null;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
      state.successMessage = null;
    },

    // 🟢 Fetch patients
    getPatientsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPatientsSuccess: (state, action: PayloadAction<Patient[]>) => {
      state.loading = false;
      state.patients = action.payload;
    },
    getPatientsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🟢 Create patient
    createPatientRequest: (
      state,
      _action: PayloadAction<Omit<Patient, "id" | "createdAt" | "updatedAt">>
    ) => {
      state.loading = true;
      state.error = null;
      state.createSuccess = false;
    },
    createPatientSuccess: (state, action: PayloadAction<Patient>) => {
      state.loading = false;
      state.patients.push(action.payload);
      state.createSuccess = true;
      state.successMessage = "Patient created successfully!";
    },
    createPatientFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.createSuccess = false;
    },

    // 🟢 Update patient
    updatePatientRequest: (state, _action: PayloadAction<Patient>) => {
      state.loading = true;
      state.error = null;
      state.updateSuccess = false;
    },
    updatePatientSuccess: (state, action: PayloadAction<Patient>) => {
      state.loading = false;
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
      state.updateSuccess = true;
      state.successMessage = "Patient updated successfully!";
    },
    updatePatientFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },

    // 🟠 Delete patient
    deletePatientRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
    },
    deletePatientSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.patients = state.patients.filter((p) => p.id !== action.payload);
      state.deleteSuccess = true;
      state.successMessage = "Patient deleted successfully!";
    },
    deletePatientFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.deleteSuccess = false;
    },
  },
});

export const {
  clearMessages,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  getPatientsRequest,
  getPatientsSuccess,
  getPatientsFailure,
  createPatientRequest,
  createPatientSuccess,
  createPatientFailure,
  updatePatientRequest,
  updatePatientSuccess,
  updatePatientFailure,
  deletePatientRequest,
  deletePatientSuccess,
  deletePatientFailure,
} = patientSlice.actions;

export default patientSlice.reducer;
