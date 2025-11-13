// sagas/eventSaga.ts
import { call, put, takeEvery } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

// Lấy URL từ biến môi trường
const BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL
const EVENT_ENDPOINT = import.meta.env.VITE_MOCKAPI_EVENT_ENDPOINT
const EVENT_FULL_URL = `${BASE_URL}${EVENT_ENDPOINT}`

// -------------------------
// 🧩 Event API Service
// -------------------------
export const eventAPI = {
  logEvent: async (eventData: any) => {
    const response = await fetch(EVENT_FULL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...eventData,
        timestamp: new Date().toISOString()
      })
    })
    if (!response.ok) throw new Error('Không thể ghi log event')
    return await response.json()
  },

  fetchEvents: async () => {
    const response = await fetch(`${EVENT_FULL_URL}?sortBy=timestamp&order=desc`)
    if (!response.ok) throw new Error('Không thể tải event logs')
    return await response.json()
  }
}

// -------------------------
// ⚙️ Event Saga Functions
// -------------------------
function* logEventSaga(action: PayloadAction<any>) {
  try {
    yield call(eventAPI.logEvent, action.payload)
    // Có thể dispatch success action nếu cần
    yield put({ type: 'events/logEventSuccess', payload: action.payload })
  } catch (error: any) {
    console.error('Failed to log event:', error)
    yield put({ type: 'events/logEventFailure', payload: error.message })
  }
}

function* fetchEventsSaga() {
  try {
    const events = yield call(eventAPI.fetchEvents)
    yield put({ type: 'events/fetchEventsSuccess', payload: events })
  } catch (error: any) {
    yield put({ type: 'events/fetchEventsFailure', payload: error.message })
  }
}

export function* eventSaga() {
  yield takeEvery('events/logEvent', logEventSaga)
  yield takeEvery('events/fetchEvents', fetchEventsSaga)
}