import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { instrumentService } from '../../services/instrumentsApi';
import { Instrument } from '../../types';
import {
  fetchInstrumentsSuccess,
  fetchInstrumentsFailure,
  addInstrumentSuccess,
  addInstrumentFailure,
  updateInstrumentSuccess,
  updateInstrumentFailure,
  deleteInstrumentSuccess,
  deleteInstrumentFailure,
  fetchInstrumentsRequest,
  addInstrumentRequest,
  updateInstrumentRequest,
  deleteInstrumentRequest,
} from '../../store/slices/instrumentsSlice';

// Get Instruments Saga - với retry logic
function* getInstrumentsSaga() {
  try {
    const instruments: Instrument[] = yield call(instrumentService.getInstruments);
    
    // ✅ Dùng action creators từ slice thay vì hard code
    yield put(fetchInstrumentsSuccess(instruments));
    
  } catch (error: any) {
    yield put(fetchInstrumentsFailure(error.message));
  }
}

// Create Instrument Saga - với validation
function* createInstrumentSaga(action: PayloadAction<Partial<Instrument>>) {
  try {
    // Validate data trước khi gọi API
    if (!action.payload.name?.trim()) {
      throw new Error('Tên thiết bị không được để trống');
    }

    const newInstrument: Instrument = yield call(
      instrumentService.createInstrument, 
      action.payload
    );
    
    // ✅ Dùng action creators từ slice
    yield put(addInstrumentSuccess(newInstrument));
    
  } catch (error: any) {
    yield put(addInstrumentFailure(error.message));
  }
}

// Update Instrument Saga - với optimistic updates
function* updateInstrumentSaga(action: PayloadAction<Instrument>) {
  // Lưu state cũ để rollback nếu cần
  const originalInstrument = action.payload;
  
  try {
    // Optimistic update - dùng action creator
    yield put(updateInstrumentSuccess(action.payload));

    // Gọi API
    const updatedInstrument: Instrument = yield call(
      instrumentService.updateInstrument, 
      action.payload
    );

    // Cập nhật với data thực từ server
    yield put(updateInstrumentSuccess(updatedInstrument));

  } catch (error: any) {
    // Rollback nếu API fail
    yield put(updateInstrumentSuccess(originalInstrument));
    
    yield put(updateInstrumentFailure(error.message));
  }
}

// Delete Instrument Saga - với optimistic delete
function* deleteInstrumentSaga(action: PayloadAction<string>) {
  const instrumentId = action.payload;
  
  try {
    // Optimistic delete - xóa ngay khỏi UI
    yield put(deleteInstrumentSuccess(instrumentId));

    // Gọi API sau khi đã cập nhật UI
    yield call(instrumentService.deleteInstrument, instrumentId);
    
    // Không cần làm gì thêm vì đã optimistic update
    
  } catch (error: any) {
    // Nếu API fail, fetch lại data để rollback
    yield put(fetchInstrumentsRequest());
    
    // Hiển thị thông báo lỗi
    yield put(deleteInstrumentFailure(`Xóa không thành công: ${error.message}`));
    
    console.warn(`Delete instrument ${instrumentId} failed:`, error.message);
  }
}

// Root Saga với error boundary
export function* instrumentSaga() {
  try {
    // ✅ Dùng action creator types từ slice
    yield takeEvery(fetchInstrumentsRequest.type, getInstrumentsSaga);
    yield takeLatest(addInstrumentRequest.type, createInstrumentSaga);
    yield takeLatest(updateInstrumentRequest.type, updateInstrumentSaga);
    yield takeLatest(deleteInstrumentRequest.type, deleteInstrumentSaga);
  } catch (error) {
    console.error('Root saga error:', error);
  }
}

// Export action types để sử dụng ở components (nếu cần)
export const INSTRUMENT_ACTION_TYPES = {
  FETCH_INSTRUMENTS_REQUEST: fetchInstrumentsRequest.type,
  ADD_INSTRUMENT_REQUEST: addInstrumentRequest.type,
  UPDATE_INSTRUMENT_REQUEST: updateInstrumentRequest.type,
  DELETE_INSTRUMENT_REQUEST: deleteInstrumentRequest.type,
} as const;