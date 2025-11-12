import { all, fork } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { userSaga } from "./userSaga";
import { patientSaga } from "./patientSaga";
import { testOrderSaga } from "./testOrderSaga";
import { instrumentSaga } from "./instrumentSaga";
import { roleSaga } from "./roleSaga";

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(userSaga),
    fork(patientSaga),
    fork(testOrderSaga),
    fork(instrumentSaga),
    fork(roleSaga),
  ]);
}
