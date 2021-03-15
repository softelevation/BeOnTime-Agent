import {ActionConstants} from '../constants';
import {
  missionListError,
  missionListSuccess,
  searchAgentsSuccess,
  searchAgentsError,
  missionsAgentError,
  missionsAgentSuccess,
} from '../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api, SearchApi, MissionAgentsApi, BookAgentsApi} from './api';
import * as navigation from '../../routes/NavigationService';
import {bookAgentError, bookAgentSuccess} from './action';

export function* missionListRequest(action) {
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
export function* searchAgentsRequest(action) {
  try {
    const response = yield call(SearchApi, action.payload);
    if (response.data.status === 1) {
      yield put(searchAgentsSuccess(response.data));
      navigation.navigate('ChooseType');
    } else {
      yield put(searchAgentsError(response));
    }
  } catch (err) {
    yield put(searchAgentsError());
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
    takeLatest(ActionConstants.MISSION_LIST_REQUEST, missionListRequest),
    takeLatest(ActionConstants.SEARCH_AGENTS_REQUEST, searchAgentsRequest),
    takeLatest(ActionConstants.MISSION_AGENTS_REQUEST, missionAgentsRequest),
    takeLatest(ActionConstants.BOOK_AGENTS_REQUEST, bookAgentsRequest),
  ]);
}
export default agentWatcher;
