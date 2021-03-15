import {combineReducers} from 'redux';
import user from './auth/reducer';
import request from './request/reducer';
import common from './common/reducer';
import payment from './payments/reducer';
import mission from './missions/reducer';
import socket from './socket/reducer';

const rootreducer = combineReducers({
  user,
  request,
  common,
  payment,
  mission,
  socket,
});
export default rootreducer;
