import {combineReducers} from 'redux';
import user from './auth/reducer';
import request from './request/reducer';
import common from './common/reducer';
import payment from './payments/reducer';
import mission from './missions/reducer';
import socket from './socket/reducer';
import notifications from './notifications/reducer';
import messages from './messages/reducer';
import {languageReducer} from './language/reducer';
import planning from './planning/reducer';
import {ActionConstants} from './constants';

const appReducer = combineReducers({
  user,
  request,
  common,
  payment,
  mission,
  socket,
  notifications,
  messages,
  languageReducer,
  planning,
});
const rootReducer = (state, action) => {
  if (action.type === ActionConstants.RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
