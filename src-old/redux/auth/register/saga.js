import {ActionConstants} from '../../constants';
import {registerError, registerSuccess} from '../../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api} from './api';
import {Alert} from 'react-native';
import Toast from 'react-native-simple-toast';

export function* request(action) {
  //alert(JSON.stringify(action.payload))
  try {
    const response = yield call(Api, action.payload);
    if (response.data.status === 1) {
      Toast.show('User Regsiter Suceesfully')
      yield put(registerSuccess(response.data));
    } else {
      Toast.show(response.data.message);
      yield put(registerError(response));
    }
  } catch (err) {
  //  alert(JSON.stringify(err))
    yield put(registerError(err));
  }
}

export function* registerWatcher() {
  yield all([takeLatest(ActionConstants.REGISTER_REQUEST, request)]);
}
export default registerWatcher;
