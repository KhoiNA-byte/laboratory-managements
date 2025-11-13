import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchReagentsRequest,
  fetchReagentsSuccess,
  fetchReagentsFailure,
  addReagentRequest,
  addReagentSuccess,
  addReagentFailure,
  deleteReagentRequest,
  deleteReagentSuccess,
  deleteReagentFailure,
  ReagentForm,
  ReagentServer,
} from "../slices/reagentSlice";

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";
const RESOURCE = "reagents";

// convert form payload to server format
function toServerPayload(f: ReagentForm): Partial<ReagentServer> {
  return {
    name: f.name,
    lot_number: f.lotNumber,
    manufacturer: f.manufacturer,
    quantity: Number(f.quantity ?? 0),
    unit: f.unit ?? "Tests",
    usage_per_run: f.usagePerRun ?? 0,
    expiry_date: f.expiryDate ?? "",
    location: f.location ?? "",
    min_stock: f.minStock ?? 0,
    max_stock: f.maxStock ?? 0,
    cost: f.cost ?? 0,
  };
}

// --- fetch reagents ---
function* fetchReagentsSaga() {
  try {
    const res: { data: ReagentServer[] } = yield call(
      axios.get,
      `${API_BASE}/${RESOURCE}`
    );
    yield put(fetchReagentsSuccess(res.data));
  } catch (err: any) {
    yield put(fetchReagentsFailure(err.message || "Fetch failed"));
  }
}

// --- add reagent ---
function* addReagentSaga(action: ReturnType<typeof addReagentRequest>) {
  try {
    const payload = toServerPayload(action.payload);
    const res: { data: ReagentServer } = yield call(
      axios.post,
      `${API_BASE}/${RESOURCE}`,
      payload
    );
    yield put(addReagentSuccess(res.data));
    // auto refresh list
    yield put(fetchReagentsRequest());
  } catch (err: any) {
    yield put(addReagentFailure(err.message || "Add failed"));
  }
}

// --- delete reagent ---
function* deleteReagentSaga(action: ReturnType<typeof deleteReagentRequest>) {
  try {
    const id = action.payload;
    yield call(axios.delete, `${API_BASE}/${RESOURCE}/${id}`);
    yield put(deleteReagentSuccess(id));
    // auto refresh list
    yield put(fetchReagentsRequest());
  } catch (err: any) {
    yield put(deleteReagentFailure(err.message || "Delete failed"));
  }
}

// --- watcher saga ---
export function* reagentSaga() {
  yield takeLatest(fetchReagentsRequest.type, fetchReagentsSaga);
  yield takeLatest(addReagentRequest.type, addReagentSaga);
  yield takeLatest(deleteReagentRequest.type, deleteReagentSaga);
}
