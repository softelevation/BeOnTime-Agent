import {ActionConstants} from '../constants';
import {
  missionListError,
  missionListSuccess,
  missionReportSubmitSuccess,
  missionReportSubmitError,
  missionsAgentError,
  missionsAgentSuccess,
  missionListRequest,
  getMissionsRequest,
} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api, missionReportApi, MissionAgentsApi, BookAgentsApi} from './api';
import * as navigation from '../../routes/NavigationService';
import {bookAgentError, bookAgentSuccess} from './action';

export function* missionListRequested(action) {
  try {
    const response = yield call(Api, action.payload);
    if (response.data.status === 1) {
      yield put(missionListSuccess(response.data.data));
    } else {
      yield put(missionListError(response));
    }
  } catch (err) {
    yield put(missionListError());
  }
}
export function* missionReportSubmit(action) {
  try {
    const response = yield call(missionReportApi, action.payload);
    if (response.data.status === 1) {
      yield put(missionReportSubmitSuccess(response.data));
      yield put(missionListRequest());
      yield put(getMissionsRequest());
    } else {
      yield put(missionReportSubmitError(response));
    }
  } catch (err) {
    yield put(missionReportSubmitError());
  }
}
export function* missionAgentsRequest(action) {
  try {
    const response = yield call(MissionAgentsApi, action.payload);
    if (response.data.status === 1) {
      yield put(missionsAgentSuccess(response.data));
    } else {
      yield put(missionsAgentError(response));
    }
  } catch (err) {
    yield put(missionsAgentError());
  }
}
export function* bookAgentsRequest(action) {
  try {
    const response = yield call(BookAgentsApi, action.payload);
    if (response.data.status === 1) {
      yield put(bookAgentSuccess(response.data));
      navigation.navigate('ReviewDetails');
    } else {
      yield put(bookAgentError(response));
    }
  } catch (err) {
    yield put(bookAgentError());
  }
}

export function* agentWatcher() {
  yield all([
    takeLatest(ActionConstants.MISSION_LIST_REQUEST, missionListRequested),
    takeLatest(
      ActionConstants.MISSION_REPORT_SUBMIT_REQUEST,
      missionReportSubmit,
    ),
    takeLatest(ActionConstants.MISSION_AGENTS_REQUEST, missionAgentsRequest),
    takeLatest(ActionConstants.BOOK_AGENTS_REQUEST, bookAgentsRequest),
  ]);
}
export default agentWatcher;
