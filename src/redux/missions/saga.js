import {ActionConstants} from '../constants';
import {
  getMissionsError,
  getMissionsSuccess,
  customMissionSuccess,
  customMissionError,
} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api, customApi} from './api';
import {Alerts} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';

export function* request(action) {
  try {
    const response = yield call(Api, action.payload);
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
export function* customRequest(action) {
  try {
    const response = yield call(customApi, action.payload);
    if (response.data.status === 1) {
      yield put(customMissionSuccess(response.data.data));
    } else {
      yield put(customMissionError(response));
      Alerts('Error', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(customMissionError(err));
  }
}
export function* missionWatcher() {
  yield all([takeLatest(ActionConstants.GET_MISSION_REQUEST, request)]);
  yield all([
    takeLatest(ActionConstants.CUSTOM_MISSION_REQUEST, customRequest),
  ]);
}
export default missionWatcher;
