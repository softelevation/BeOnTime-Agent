import {ActionConstants} from '../../constants';
import {profileError, profileSuccess} from '../../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api, updateApi} from './api';
import {
  profileRequest,
  updateProfileError,
  updateProfileSuccess,
} from './action';
import {Alerts} from '../../../utils/commonUtils';
import {light} from '../../../components/theme/colors';
import * as navigation from '../../../routes/NavigationService';

export function* request(action) {
  try {
    const response = yield call(Api, action.payload);
    if (response) {
      yield put(profileSuccess(response.data));
    } else {
      yield put(profileError(response));
    }
  } catch (err) {
    yield put(profileError(err));
  }
}
export function* updateRequest(action) {
  try {
    const response = yield call(updateApi, action.payload);
    if (response) {
      yield put(profileRequest());
      yield put(updateProfileSuccess(response.data));
      Alerts('Success', 'Profile updated successfully', light.success);
      navigation.navigate('Home');
    } else {
      yield put(profileError(response));
      yield put(updateProfileError(response));
    }
  } catch (err) {
    yield put(profileError(err));
    yield put(updateProfileError(err));
  }
}

export function* profileWatcher() {
  yield all([takeLatest(ActionConstants.PROFILE_REQUEST, request)]);
  yield all([
    takeLatest(ActionConstants.UPDATE_PROFILE_REQUEST, updateRequest),
  ]);
}
export default profileWatcher;
