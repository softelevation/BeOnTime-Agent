import {ActionConstants} from '../constants';
import {makePaymentError, makePaymentSuccess} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {paymentApi} from './api';
import {Alerts} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';

export function* request(action) {
  try {
    const response = yield call(paymentApi, action.payload);
    if (response.data.status === 1) {
      yield put(makePaymentSuccess(response.data));
    } else {
      yield put(makePaymentError(response));
      Alerts('', response.data.data.code, light.danger);
    }
  } catch (err) {
    yield put(makePaymentError());
  }
}
export function* paymentWatcher() {
  yield all([takeLatest(ActionConstants.MAKE_PAYMENT_REQUEST, request)]);
}
export default paymentWatcher;
