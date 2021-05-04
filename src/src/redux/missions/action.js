import {ActionConstants} from '../constants';
// Agent List
export const getMissionsRequest = (payload) => {
  return {
    type: ActionConstants.GET_MISSION_REQUEST,
    payload,
    res: false,
  };
};
export const getMissionsSuccess = (data) => {
  return {
    type: ActionConstants.GET_MISSION_SUCCESS,
    data,
    res: true,
  };
};
export const getMissionsError = (error) => {
  return {
    type: ActionConstants.GET_MISSION_ERROR,
    error,
    res: false,
  };
};
