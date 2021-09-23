import {ActionConstants} from '../constants';
// Agent List
export const getPlanningRequest = () => {
  return {
    type: ActionConstants.PLANNING_REQUEST,
    res: false,
  };
};
export const getPlanningSuccess = (data) => {
  return {
    type: ActionConstants.PLANNING_SUCCESS,
    data,
    res: true,
  };
};
export const getPlanningError = (error) => {
  return {
    type: ActionConstants.PLANNING_ERROR,
    error,
    res: false,
  };
};
export const addPlanningRequest = (payload) => {
  return {
    type: ActionConstants.ADD_PLANNING_REQUEST,
    payload,
    res: false,
  };
};
export const addPlanningSuccess = (data) => {
  return {
    type: ActionConstants.ADD_PLANNING_SUCCESS,
    data,
    res: true,
  };
};
export const addPlanningError = (error) => {
  return {
    type: ActionConstants.ADD_PLANNING_ERROR,
    error,
    res: false,
  };
};
