import {ActionConstants} from '../constants';
import {getPlanningError, getPlanningSuccess} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api} from './api';
import {Alerts} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';

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
export function* planningWatcher() {
  yield all([takeLatest(ActionConstants.PLANNING_REQUEST, request)]);
}
export default planningWatcher;
