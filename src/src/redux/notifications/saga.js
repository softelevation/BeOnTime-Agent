import {ActionConstants} from '../constants';
import {
  getNotificationError,
  getNotificationSuccess,
  deleteNotificationSuccess,
  deleteNotificationError,
  getNotificationRequest,
} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api, deleteApi} from './api';
import {Alerts} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';

export function* request(action) {
  try {
    const response = yield call(Api, action.payload);
    console.log(response, 'noti');
    if (response.data.status === 1) {
      yield put(getNotificationSuccess(response.data.data));
    } else {
      yield put(getNotificationError(response));
      Alerts('Error', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(getNotificationError());
  }
}

export function* delrequest(action) {
  try {
    const response = yield call(deleteApi, action.payload);
    if (response.data.status === 1) {
      yield put(deleteNotificationSuccess(response.data));
      yield put(getNotificationRequest());
      Alerts('Success', response.data.message, light.success);
    } else {
      yield put(deleteNotificationError(response));
    }
  } catch (err) {
    yield put(deleteNotificationError());
  }
}

export function* notificationWatcher() {
  yield all([takeLatest(ActionConstants.GET_NOTIFICATIONS_REQUEST, request)]);
  yield all([
    takeLatest(ActionConstants.DELETE_NOTIFICATIONS_REQUEST, delrequest),
  ]);
}
export default notificationWatcher;
