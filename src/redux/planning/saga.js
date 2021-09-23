import {ActionConstants} from '../constants';
import {
  getPlanningError,
  getPlanningSuccess,
  addPlanningError,
  addPlanningSuccess,
} from './action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api, SaveScheduleApi} from './api';
import {Alerts} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';
import * as navigation from '../../routes/NavigationService';

export function* request(action) {
  try {
    const response = yield call(Api, action.payload);
    if (response.data.status === 1) {
      yield put(getPlanningSuccess(response.data.data));
    } else {
      yield put(getPlanningError(response));
      Alerts('Error', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(getPlanningError());
  }
}
export function* saveRequest(action) {
  try {
    const response = yield call(SaveScheduleApi, action.payload);
    if (response.data.status === 1) {
      yield put(addPlanningSuccess(response.data.data));
      navigation.goBack();
    } else {
      yield put(addPlanningError(response));
      Alerts('Error', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(addPlanningError());
  }
}
export function* planningWatcher() {
  yield all([takeLatest(ActionConstants.PLANNING_REQUEST, request)]);
  yield all([takeLatest(ActionConstants.ADD_PLANNING_REQUEST, saveRequest)]);
}
export default planningWatcher;
