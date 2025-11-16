
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import patientReducer from "./slices/patientSlice";
import testOrderReducer from "./slices/testOrderSlice";
import instrumentReducer from "./slices/instrumentsSlice";
import roleReducer from "./slices/roleSlice";
import testResultsReducer from "./slices/testResultsSlice"; 
import reagentReducer from "./slices/reagentSlice"; 
import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    patients: patientReducer,
    testOrders: testOrderReducer,
    instruments: instrumentReducer,
    roles: roleReducer,
    reagents: reagentReducer,
    testResults: testResultsReducer, // <-- THÊM DÒNG NÀY
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware),
});

// run saga
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
