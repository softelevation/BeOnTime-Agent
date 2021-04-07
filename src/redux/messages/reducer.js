import {combineReducers} from 'redux';
import {ActionConstants} from '../constants';
const initialState = {
  loading: false,
  data: [],
  error: '',
  isSuccess: false,
};
export function chat(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.GET_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
        isSuccess: false,
      };
    case ActionConstants.GET_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
        isSuccess: true,
      };
    case ActionConstants.GET_CHAT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        isSuccess: false,
      };

    default:
      return state;
  }
}
const initialMessageState = {
  loading: false,
  data: [],
  error: '',
  isSuccess: false,
};
export function chatById(state = initialMessageState, action) {
  switch (action.type) {
    case ActionConstants.GET_CHAT_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        isSuccess: false,
      };
    case ActionConstants.GET_CHAT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
        isSuccess: true,
      };
    case ActionConstants.GET_CHAT_BY_ID_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        isSuccess: false,
      };
    default:
      return state;
  }
}

const message_center = combineReducers({
  chat,
  chatById,
});
export default message_center;
