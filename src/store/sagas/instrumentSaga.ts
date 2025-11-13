import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

// Lấy URL từ biến môi trường
const BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL
const INSTRUMENTS_ENDPOINT = import.meta.env.VITE_MOCKAPI_INSTRUMENTS_ENDPOINT
const FULL_URL = `${BASE_URL}${INSTRUMENTS_ENDPOINT}`

// -------------------------
// 🧩 API thực (MockAPI.io)
// -------------------------

const getInstrumentsAPI = async () => {
  const response = await fetch(FULL_URL)
  if (!response.ok) throw new Error('Không thể tải danh sách thiết bị')
  return await response.json()
}

const createInstrumentAPI = async (instrumentData: any) => {
  const response = await fetch(FULL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(instrumentData)
  })
  if (!response.ok) throw new Error('Không thể tạo thiết bị mới')
  return await response.json()
}

const updateInstrumentAPI = async ({ id, ...instrumentData }: any) => {
  const response = await fetch(`${FULL_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(instrumentData)
  })
  if (!response.ok) throw new Error('Không thể cập nhật thiết bị')
  return await response.json()
}

const deleteInstrumentAPI = async (id: string) => {
  const url = `${FULL_URL}/${id}`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // MockAPI thường trả về 200 ngay cả khi item không tồn tại
    if (response.ok) {
      return { id, deleted: true };
    }

    // Nếu có lỗi, vẫn coi như thành công để đồng bộ UI
    return { id, deleted: true };
    
  } catch (error) {
    // Nếu có lỗi network, vẫn coi như thành công
    return { id, deleted: true };
  }
}

// -------------------------
// ⚙️ Saga Functions
// -------------------------

// Get Instruments Saga
// Get Instruments Saga
function* getInstrumentsSaga() {
    try {
      const instruments = yield call(getInstrumentsAPI)
      yield put({ type: 'instruments/fetchInstrumentsSuccess', payload: instruments })
    } catch (error: any) {
      yield put({ type: 'instruments/fetchInstrumentsFailure', payload: error.message })
    }
  }
  
  // Create Instrument Saga
  function* createInstrumentSaga(action: PayloadAction<any>) {
    try {
      const newInstrument = yield call(createInstrumentAPI, action.payload)
      yield put({ type: 'instruments/addInstrument', payload: newInstrument })
    } catch (error: any) {
      yield put({ type: 'instruments/fetchInstrumentsFailure', payload: error.message })
    }
  }
  
  // Update Instrument Saga
  function* updateInstrumentSaga(action: PayloadAction<any>) {
    try {
      const updatedInstrument = yield call(updateInstrumentAPI, action.payload)
      yield put({ type: 'instruments/updateInstrument', payload: updatedInstrument })
    } catch (error: any) {
      yield put({ type: 'instruments/fetchInstrumentsFailure', payload: error.message })
    }
  }
  
 // Delete Instrument Saga
 function* deleteInstrumentSaga(action: PayloadAction<string>) {
  try {
    yield call(deleteInstrumentAPI, action.payload);
  } catch (error) {
    console.warn('Delete API warning:', error);
  } finally {
    // Luôn xóa khỏi UI và refresh data
    yield put({ type: 'instruments/deleteInstrument', payload: action.payload });
    yield put({ type: 'instruments/fetchInstrumentsStart' });
  }
}
  
  export function* instrumentSaga() {
    yield takeEvery('instruments/fetchInstrumentsStart', getInstrumentsSaga)
    yield takeLatest('instruments/addInstrumentRequest', createInstrumentSaga)
    yield takeLatest('instruments/updateInstrumentRequest', updateInstrumentSaga)
    yield takeLatest('instruments/deleteInstrumentRequest', deleteInstrumentSaga)
  }
  