import {ActionConstants} from '../constants';
import {
  getChatError,
  getChatSuccess,
  getChatByIdError,
  getChatByIdSuccess,
} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {chatApi, chatApiById} from './api';
import {Alerts} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';

export function* request(action) {
  try {
    const response = yield call(chatApi, action.payload);
    if (response.data.status === 1) {
      console.log(response.data, 'get Chat');
      yield put(getChatSuccess(response.data.data));
    } else {
      yield put(getChatError(response));
      Alerts('Error', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(getChatError());
  }
}
export function* chatByIdRequest(action) {
  try {
    const response = yield call(chatApiById, action.payload);
    if (response.data.status === 1) {
      yield put(getChatByIdSuccess(response.data.data));
    } else {
      yield put(getChatByIdError(response));
      Alerts('Error', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(getChatByIdError());
  }
}
export function* messageWatcher() {
  yield all([takeLatest(ActionConstants.GET_CHAT_REQUEST, request)]);
  yield all([
    takeLatest(ActionConstants.GET_CHAT_BY_ID_REQUEST, chatByIdRequest),
  ]);
}
export default messageWatcher;
