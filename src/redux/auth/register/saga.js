import {ActionConstants} from '../../constants';
import {registerError, registerSuccess} from '../../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api} from './api';
import {Alert} from 'react-native';

export function* request(action) {
  try {
    const response = yield call(Api, action.payload);
    if (response.data.status === 1) {
      yield put(registerSuccess(response.data));
    } else {
      Alert.alert(response.data.message);
      yield put(registerError(response));
    }
  } catch (err) {
    yield put(registerError(err));
  }
}

export function* registerWatcher() {
  yield all([takeLatest(ActionConstants.REGISTER_REQUEST, request)]);
}
export default registerWatcher;
