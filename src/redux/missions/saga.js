import {ActionConstants} from '../constants';
import {getMissionsError, getMissionsSuccess} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api} from './api';
import {Alerts} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';

export function* request(action) {
  try {
    const response = yield call(Api, action.payload);
    console.log("mission===>>>",JSON.stringify(response))
    if (response.data.status === 1) {
      yield put(getMissionsSuccess(response.data.data));
    } else {
      yield put(getMissionsError(response));
      Alerts('Error', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(getMissionsError());
  }
}
export function* missionWatcher() {
  yield all([takeLatest(ActionConstants.GET_MISSION_REQUEST, request)]);
}
export default missionWatcher;
