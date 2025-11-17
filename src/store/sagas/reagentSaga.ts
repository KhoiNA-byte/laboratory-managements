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
  updateReagentRequest,
  updateReagentSuccess,
  updateReagentFailure,
  ReagentForm,
  ReagentServer,
  UpdateReagentPayload,
} from "../slices/reagentSlice";

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io";
const RESOURCE = "reagents";

const sid = (v: any) => (v === null || v === undefined ? "" : String(v));

function toServerPayload(
  f: ReagentForm | Partial<ReagentServer>
): Partial<ReagentServer> {
  // Accept either ReagentForm or partial server object
  return {
    name: (f as any).name,
    lot_number: (f as any).lotNumber ?? (f as any).lot_number,
    manufacturer: (f as any).manufacturer,
    quantity: Number((f as any).quantity ?? 0),
    unit: (f as any).unit ?? "Tests",
    usage_per_run: (f as any).usagePerRun ?? (f as any).usage_per_run ?? 0,
    expiry_date: (f as any).expiryDate ?? (f as any).expiry_date ?? "",
    location: (f as any).location ?? "",
    min_stock: (f as any).minStock ?? (f as any).min_stock ?? 0,
    max_stock: (f as any).maxStock ?? (f as any).max_stock ?? 0,
    cost: (f as any).cost ?? 0,
  };
}

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

function* addReagentSaga(action: ReturnType<typeof addReagentRequest>) {
  try {
    const payload = toServerPayload(action.payload as ReagentForm);
    const res: { data: ReagentServer } = yield call(
      axios.post,
      `${API_BASE}/${RESOURCE}`,
      payload
    );
    yield put(addReagentSuccess(res.data));
    yield put(fetchReagentsRequest());
  } catch (err: any) {
    yield put(addReagentFailure(err.message || "Add failed"));
  }
}

function* deleteReagentSaga(action: ReturnType<typeof deleteReagentRequest>) {
  try {
    const id = action.payload;
    yield call(
      axios.delete,
      `${API_BASE}/${RESOURCE}/${encodeURIComponent(sid(id))}`
    );
    yield put(deleteReagentSuccess(id));
    yield put(fetchReagentsRequest());
  } catch (err: any) {
    yield put(deleteReagentFailure(err.message || "Delete failed"));
  }
}

// --- update reagent ---
function* updateReagentSaga(action: ReturnType<typeof updateReagentRequest>) {
  try {
    const payload: UpdateReagentPayload =
      action.payload as UpdateReagentPayload;
    const id = payload.id;
    const dataPayload = toServerPayload(payload.data as any);

    // Try PATCH first
    try {
      const res: { data: ReagentServer } = yield call(
        axios.patch,
        `${API_BASE}/${RESOURCE}/${encodeURIComponent(sid(id))}`,
        dataPayload
      );
      yield put(updateReagentSuccess(res.data));
    } catch (errPatch) {
      // fallback to PUT: fetch existing then PUT merged
      try {
        const existingRes: { data: ReagentServer } = yield call(
          axios.get,
          `${API_BASE}/${RESOURCE}/${encodeURIComponent(sid(id))}`
        );
        const existing = existingRes.data ?? ({} as ReagentServer);
        const putPayload = { ...existing, ...dataPayload };
        const putRes: { data: ReagentServer } = yield call(
          axios.put,
          `${API_BASE}/${RESOURCE}/${encodeURIComponent(sid(id))}`,
          putPayload
        );
        yield put(updateReagentSuccess(putRes.data));
      } catch (errPut) {
        throw errPut;
      }
    }

    // refresh list to ensure UI in sync (also keeps behaviour consistent with add/delete)
    yield put(fetchReagentsRequest());
  } catch (err: any) {
    yield put(updateReagentFailure(err.message || "Update failed"));
  }
}

export function* reagentSaga() {
  yield takeLatest(fetchReagentsRequest.type, fetchReagentsSaga);
  yield takeLatest(addReagentRequest.type, addReagentSaga);
  yield takeLatest(deleteReagentRequest.type, deleteReagentSaga);
  yield takeLatest(updateReagentRequest.type, updateReagentSaga);
}
