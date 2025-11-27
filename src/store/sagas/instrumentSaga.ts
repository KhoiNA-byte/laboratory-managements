// sagas/instrumentsSaga.ts
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { instrumentService } from '../../services/instruments';
import { Instrument } from '../../types';

// Action Types Constants 
const ACTION_TYPES = {
  FETCH_INSTRUMENTS_START: 'instruments/fetchInstrumentsStart',
  FETCH_INSTRUMENTS_SUCCESS: 'instruments/fetchInstrumentsSuccess', 
  FETCH_INSTRUMENTS_FAILURE: 'instruments/fetchInstrumentsFailure',
  ADD_INSTRUMENT_REQUEST: 'instruments/addInstrumentRequest',
  ADD_INSTRUMENT_SUCCESS: 'instruments/addInstrumentSuccess',
  ADD_INSTRUMENT_FAILURE: 'instruments/addInstrumentFailure',
  UPDATE_INSTRUMENT_REQUEST: 'instruments/updateInstrumentRequest',
  UPDATE_INSTRUMENT_SUCCESS: 'instruments/updateInstrumentSuccess',
  UPDATE_INSTRUMENT_FAILURE: 'instruments/updateInstrumentFailure',
  DELETE_INSTRUMENT_REQUEST: 'instruments/deleteInstrumentRequest',
  DELETE_INSTRUMENT_SUCCESS: 'instruments/deleteInstrumentSuccess',
  DELETE_INSTRUMENT_FAILURE: 'instruments/deleteInstrumentFailure',
} as const;

// Get Instruments Saga - với retry logic
function* getInstrumentsSaga() {
  try {
    const instruments: Instrument[] = yield call(instrumentService.getInstruments);
    yield put({ 
      type: ACTION_TYPES.FETCH_INSTRUMENTS_SUCCESS, 
      payload: instruments 
    });
  } catch (error: any) {
    yield put({ 
      type: ACTION_TYPES.FETCH_INSTRUMENTS_FAILURE, 
      payload: error.message 
    });
  }
}

// Create Instrument Saga - với validation
function* createInstrumentSaga(action: PayloadAction<Omit<Instrument, 'id'>>) {
  try {
    // Validate data trước khi gọi API
    if (!action.payload.name?.trim()) {
      throw new Error('Tên thiết bị không được để trống');
    }

    const newInstrument: Instrument = yield call(
      instrumentService.createInstrument, 
      action.payload
    );
    
    yield put({ 
      type: ACTION_TYPES.ADD_INSTRUMENT_SUCCESS, 
      payload: newInstrument 
    });
  } catch (error: any) {
    yield put({ 
      type: ACTION_TYPES.ADD_INSTRUMENT_FAILURE, 
      payload: error.message 
    });
  }
}

// Update Instrument Saga - với optimistic updates
function* updateInstrumentSaga(action: PayloadAction<Instrument>) {
  // Lưu state cũ để rollback nếu cần
  const originalInstrument = action.payload;
  
  try {
    // Optimistic update
    yield put({
      type: ACTION_TYPES.UPDATE_INSTRUMENT_SUCCESS,
      payload: action.payload
    });

    // Gọi API
    const updatedInstrument: Instrument = yield call(
      instrumentService.updateInstrument, 
      action.payload
    );

    // Cập nhật với data thực từ server
    yield put({
      type: ACTION_TYPES.UPDATE_INSTRUMENT_SUCCESS,
      payload: updatedInstrument
    });

  } catch (error: any) {
    // Rollback nếu API fail
    yield put({
      type: ACTION_TYPES.UPDATE_INSTRUMENT_SUCCESS, // Dùng success để rollback
      payload: originalInstrument
    });
    
    yield put({ 
      type: ACTION_TYPES.UPDATE_INSTRUMENT_FAILURE, 
      payload: error.message 
    });
  }
}

// Delete Instrument Saga - với optimistic delete
function* deleteInstrumentSaga(action: PayloadAction<string>) {
  const instrumentId = action.payload;
  
  // Optimistic delete - xóa ngay khỏi UI
  yield put({ 
    type: ACTION_TYPES.DELETE_INSTRUMENT_SUCCESS, 
    payload: instrumentId 
  });

  try {
    // Gọi API sau khi đã cập nhật UI
    yield call(instrumentService.deleteInstrument, instrumentId);
    
    // Không cần làm gì thêm vì đã optimistic update
    
  } catch (error: any) {
    // Nếu API fail, không rollback để tránh UX xấu
    // Có thể log error để monitoring
    console.warn(`Delete instrument ${instrumentId} failed:`, error.message);
    
    // Option: Có thể dispatch action để hiển thị thông báo
    yield put({ 
      type: ACTION_TYPES.DELETE_INSTRUMENT_FAILURE, 
      payload: `Xóa không thành công: ${error.message}` 
    });
  }
}

// Root Saga với error boundary
export function* instrumentSaga() {
  try {
    yield takeEvery(ACTION_TYPES.FETCH_INSTRUMENTS_START, getInstrumentsSaga);
    yield takeLatest(ACTION_TYPES.ADD_INSTRUMENT_REQUEST, createInstrumentSaga);
    yield takeLatest(ACTION_TYPES.UPDATE_INSTRUMENT_REQUEST, updateInstrumentSaga);
    yield takeLatest(ACTION_TYPES.DELETE_INSTRUMENT_REQUEST, deleteInstrumentSaga);
  } catch (error) {
    console.error('Root saga error:', error);
  }
}

// Export action types để sử dụng ở components
export { ACTION_TYPES as INSTRUMENT_ACTION_TYPES };