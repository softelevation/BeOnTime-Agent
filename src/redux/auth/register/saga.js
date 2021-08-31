import {ActionConstants} from '../../constants';
import {registerError, registerSuccess} from '../../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import * as navigation from '../../../routes/NavigationService';
import {Api} from './api';
import {Alerts} from '../../../utils/commonUtils';
import {light} from '../../../components/theme/colors';

export function* request(action) {
  //alert(JSON.stringify(action.payload))
  try {
    const response = yield call(Api, action.payload);
    if (response.data.status === 1) {
      ///  alert(JSON.stringify(response.data))
      // navigation.navigate('Home');
      navigation.navigate('Login');
      yield put(registerSuccess(response.data));
      Alerts('', response.data.message, light.success);
    } else {
      Alerts('', response.data.message, light.danger);
      yield put(registerError(response));
    }
  } catch (err) {
    Alerts('', err.response.data.message, light.danger);

    yield put(registerError(err));
  }
}

export function* registerWatcher() {
  yield all([takeLatest(ActionConstants.REGISTER_REQUEST, request)]);
}
export default registerWatcher;
