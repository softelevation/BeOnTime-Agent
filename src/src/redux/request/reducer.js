import {combineReducers} from 'redux';
import {ActionConstants} from '../constants';
const initialState = {
  loading: false,
  agents: [],
  error: '',
};
export function list(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.MISSION_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.MISSION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        agents: action.data,
      };
    case ActionConstants.MISSION_LIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
}

const initialSearchState = {
  loading: false,
  searchList: [],
  error: '',
  isSuccess: false,
};
export function missionReport(state = initialSearchState, action) {
  switch (action.type) {
    case ActionConstants.MISSION_REPORT_SUBMIT_REQUEST:
      return {
        ...state,
        loading: true,
        isSuccess: false,
      };
    case ActionConstants.MISSION_REPORT_SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        searchList: action.data,
        isSuccess: true,
      };
    case ActionConstants.MISSION_REPORT_SUBMIT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        isSuccess: false,
      };
    case ActionConstants.MISSION_REPORT_SUBMIT_FLUSH:
      return {
        ...state,
        loading: false,
        error: '',
        isSuccess: false,
        searchList: [],
      };

    default:
      return state;
  }
}

const initialMissionsState = {
  loading: false,
  searchList: [],
  error: '',
};
export function agentMissionList(state = initialMissionsState, action) {
  switch (action.type) {
    case ActionConstants.MISSION_AGENTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.MISSION_AGENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchList: action.data,
      };
    case ActionConstants.MISSION_AGENTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ActionConstants.MISSION_AGENTS_FLUSH:
      return {
        ...state,
        searchList: [],
        loading: false,
        error: '',
      };

    default:
      return state;
  }
}

const initialBookAgentState = {
  loading: false,
  bookAgents: [],
  error: '',
};
export function bookAgennts(state = initialBookAgentState, action) {
  switch (action.type) {
    case ActionConstants.BOOK_AGENTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.BOOK_AGENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        bookAgents: action.data,
      };
    case ActionConstants.BOOK_AGENTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
}

const request = combineReducers({
  list,
  missionReport,
  agentMissionList,
  bookAgennts,
});
export default request;
