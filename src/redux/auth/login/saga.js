import {ActionConstants} from '../../constants';
import {loginError, loginSuccess} from '../../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api} from './api';
import AsyncStorage from '@react-native-community/async-storage';
import * as navigation from '../../../routes/NavigationService';
import {Alerts} from '../../../utils/commonUtils';
import {light} from '../../../components/theme/colors';
import {profileRequest} from '../profile/action';
const SaveToken = async (token) => {
  return await AsyncStorage.setItem('token', token.data.accessToken);
};

const SaveData = async (data) => {
  return await AsyncStorage.setItem('user', JSON.stringify(data));
};

export function* loginRequest(action) {
  try {
    const response = yield call(Api, action.payload);
    if (response.data.status === 1) {
      yield call(SaveToken, response.data);
      yield call(SaveData, response.data);
      yield put(loginSuccess(response.data));
      yield put(profileRequest());

      Alerts('Login Successful', response.data.message, light.success);
      navigation.navigate('Home');
    } else {
      yield put(loginError(response.data.message));
      Alerts('Login Failed', response.data.message, light.danger);
    }
  } catch (err) {
    yield put(loginError(err.response.data.message));
    Alerts('Login Failed', err.response.data.message, light.danger);
  }
}

export function* loginWatcher() {
  yield all([takeLatest(ActionConstants.LOGIN_REQUEST, loginRequest)]);
}
export default loginWatcher;
