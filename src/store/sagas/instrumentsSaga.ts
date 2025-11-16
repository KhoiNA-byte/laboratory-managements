// src/store/sagas/instrumentsSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchInstrumentsRequest,
  fetchInstrumentsSuccess,
  fetchInstrumentsFailure,
  addInstrumentRequest,
  addInstrumentSuccess,
  addInstrumentFailure,
  deleteInstrumentRequest,
  deleteInstrumentSuccess,
  deleteInstrumentFailure,
  Instrument,
} from "../slices/instrumentsSlice";

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io/";
const RESOURCE = "instruments";

function* fetchInstrumentsSaga(): Generator<any, void, any> {
  try {
    const res: any = yield call(axios.get, `${API_BASE}/${RESOURCE}`);
    yield put(fetchInstrumentsSuccess(res.data));
  } catch (err: any) {
    yield put(fetchInstrumentsFailure(err.message));
  }
}

function* addInstrumentSaga(
  action: ReturnType<typeof addInstrumentRequest>
): Generator<any, void, any> {
  try {
    const res: any = yield call(
      axios.post,
      `${API_BASE}/${RESOURCE}`,
      action.payload
    );
    yield put(addInstrumentSuccess(res.data));
  } catch (err: any) {
    yield put(addInstrumentFailure(err.message));
  }
}

function* deleteInstrumentSaga(
  action: ReturnType<typeof deleteInstrumentRequest>
): Generator<any, void, any> {
  try {
    yield call(axios.delete, `${API_BASE}/${RESOURCE}/${action.payload}`);
    yield put(deleteInstrumentSuccess(action.payload));
  } catch (err: any) {
    yield put(deleteInstrumentFailure(err.message));
  }
}

export function* instrumentsSaga() {
  yield takeLatest(fetchInstrumentsRequest.type, fetchInstrumentsSaga);
  yield takeLatest(addInstrumentRequest.type, addInstrumentSaga);
  yield takeLatest(deleteInstrumentRequest.type, deleteInstrumentSaga);
}
