import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

// Mock API functions
const mockGetTestOrdersAPI = async () => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return [
    {
      id: "1",
      patientId: "1",
      patientName: "John Doe",
      testType: "Complete Blood Count",
      status: "pending",
      priority: "normal",
      orderedBy: "Dr. Smith",
      orderedDate: "2024-01-15T09:00:00Z",
      expectedDate: "2024-01-16T09:00:00Z",
      notes: "Routine checkup",
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Jane Smith",
      testType: "Lipid Panel",
      status: "in_progress",
      priority: "high",
      orderedBy: "Dr. Johnson",
      orderedDate: "2024-01-15T10:30:00Z",
      expectedDate: "2024-01-15T16:00:00Z",
      notes: "Follow-up for cholesterol",
    },
    {
      id: "3",
      patientId: "3",
      patientName: "Bob Johnson",
      testType: "Liver Function Test",
      status: "completed",
      priority: "normal",
      orderedBy: "Dr. Brown",
      orderedDate: "2024-01-14T14:00:00Z",
      expectedDate: "2024-01-15T14:00:00Z",
      notes: "Medication monitoring",
    },
  ];
};

const mockCreateTestOrderAPI = async (orderData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1100));
  return {
    id: Date.now().toString(),
    ...orderData,
    status: "pending",
    orderedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

const mockUpdateTestOrderAPI = async ({ id, ...orderData }: any) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    id,
    ...orderData,
    updatedAt: new Date().toISOString(),
  };
};

const mockDeleteTestOrderAPI = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, id };
};

// Get Test Orders Saga
function* getTestOrdersSaga() {
  try {
    const testOrders = yield call(mockGetTestOrdersAPI);
    yield put({ type: "testOrders/getTestOrdersSuccess", payload: testOrders });
  } catch (error: any) {
    yield put({
      type: "testOrders/getTestOrdersFailure",
      payload: error.message,
    });
  }
}

// Create Test Order Saga
function* createTestOrderSaga(action: PayloadAction<any>) {
  try {
    const newTestOrder = yield call(mockCreateTestOrderAPI, action.payload);
    yield put({
      type: "testOrders/createTestOrderSuccess",
      payload: newTestOrder,
    });
  } catch (error: any) {
    yield put({
      type: "testOrders/createTestOrderFailure",
      payload: error.message,
    });
  }
}

// Update Test Order Saga
function* updateTestOrderSaga(action: PayloadAction<any>) {
  try {
    const updatedTestOrder = yield call(mockUpdateTestOrderAPI, action.payload);
    yield put({
      type: "testOrders/updateTestOrderSuccess",
      payload: updatedTestOrder,
    });
  } catch (error: any) {
    yield put({
      type: "testOrders/updateTestOrderFailure",
      payload: error.message,
    });
  }
}

// Delete Test Order Saga
function* deleteTestOrderSaga(action: PayloadAction<string>) {
  try {
    const result = yield call(mockDeleteTestOrderAPI, action.payload);
    yield put({
      type: "testOrders/deleteTestOrderSuccess",
      payload: result.id,
    });
  } catch (error: any) {
    yield put({
      type: "testOrders/deleteTestOrderFailure",
      payload: error.message,
    });
  }
}

export function* testOrderSaga() {
  yield takeEvery("testOrders/getTestOrdersRequest", getTestOrdersSaga);
  yield takeLatest("testOrders/createTestOrderRequest", createTestOrderSaga);
  yield takeLatest("testOrders/updateTestOrderRequest", updateTestOrderSaga);
  yield takeLatest("testOrders/deleteTestOrderRequest", deleteTestOrderSaga);
}
