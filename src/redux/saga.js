import {all} from 'redux-saga/effects';
import {loginWatcher} from './auth/login/saga';
import {profileWatcher} from './auth/profile/saga';
import {agentWatcher} from './request/saga';
import {registerWatcher} from './auth/register/saga';
import {paymentWatcher} from './payments/saga';
import {missionWatcher} from './missions/saga';

export default function* rootSaga() {
  yield all([
    loginWatcher(),
    agentWatcher(),
    registerWatcher(),
    profileWatcher(),
    paymentWatcher(),
    missionWatcher(),
  ]);
}
