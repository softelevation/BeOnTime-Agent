import {ActionConstants} from '../constants';
// Agent List
export const missionListRequest = (payload) => {
  return {
    type: ActionConstants.MISSION_LIST_REQUEST,
    payload,
    res: false,
  };
};
export const missionListSuccess = (data) => {
  return {
    type: ActionConstants.MISSION_LIST_SUCCESS,
    data,
    res: true,
  };
};
export const missionListError = (error) => {
  return {
    type: ActionConstants.MISSION_LIST_ERROR,
    error,
    res: false,
  };
};
// Search Agents List
export const missionReportSubmitRequest = (payload) => {
  return {
    type: ActionConstants.MISSION_REPORT_SUBMIT_REQUEST,
    payload,
    res: false,
  };
};
export const missionReportSubmitSuccess = (data) => {
  return {
    type: ActionConstants.MISSION_REPORT_SUBMIT_SUCCESS,
    data,
    res: true,
  };
};
export const missionReportSubmitError = (error) => {
  return {
    type: ActionConstants.MISSION_REPORT_SUBMIT_ERROR,
    error,
    res: false,
  };
};
export const missionReportSubmitFlush = () => {
  return {
    type: ActionConstants.MISSION_REPORT_SUBMIT_FLUSH,
    res: false,
  };
};

export const missionsAgentRequest = (payload) => {
  return {
    type: ActionConstants.MISSION_AGENTS_REQUEST,
    payload,
    res: false,
  };
};
export const missionsAgentSuccess = (data) => {
  return {
    type: ActionConstants.MISSION_AGENTS_SUCCESS,
    data,
    res: true,
  };
};
export const missionsAgentError = (error) => {
  return {
    type: ActionConstants.MISSION_AGENTS_ERROR,
    error,
    res: false,
  };
};
export const flushMissionAgents = () => {
  return {
    type: ActionConstants.MISSION_AGENTS_FLUSH,
  };
};
//Book Agents

export const bookAgentRequest = (payload) => {
  return {
    type: ActionConstants.BOOK_AGENTS_REQUEST,
    payload,
    res: false,
  };
};
export const bookAgentSuccess = (data) => {
  return {
    type: ActionConstants.BOOK_AGENTS_SUCCESS,
    data,
    res: true,
  };
};
export const bookAgentError = (error) => {
  return {
    type: ActionConstants.BOOK_AGENTS_ERROR,
    error,
    res: false,
  };
};
