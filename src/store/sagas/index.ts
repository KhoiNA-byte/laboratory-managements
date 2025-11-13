import { all, fork } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { userSaga } from "./userSaga";
import { patientSaga } from "./patientSaga";
import { testOrderSaga } from "./testOrderSaga";
import { instrumentsSaga } from "./instrumentsSaga";
import { reagentSaga } from "./reagentSaga";
import { testResultsSaga } from "./testResultsSaga";

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(userSaga),
    fork(patientSaga),
    fork(testOrderSaga),
    fork(instrumentsSaga),
    fork(reagentSaga),
    fork(testResultsSaga),
  ]);
}
