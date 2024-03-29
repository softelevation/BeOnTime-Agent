import {ActionConstants} from './constants';

export {
  loginError,
  loginRequest,
  loginSuccess,
  changePasswordError,
  changePasswordRequest,
  changePasswordSuccess,
} from './auth/login/action';
export {
  registerError,
  registerRequest,
  registerSuccess,
} from './auth/register/action';
export {
  profileError,
  profileRequest,
  profileSuccess,
  profileFlush,
  updateProfileError,
  updateProfileRequest,
  updateProfileSuccess,
} from './auth/profile/action';
export {
  generateOtpError,
  generateOtpRequest,
  generateOtpSuccess,
} from './auth/otp/action';
export {
  missionListError,
  missionListRequest,
  missionListSuccess,
  missionReportSubmitError,
  missionReportSubmitRequest,
  missionReportSubmitSuccess,
  missionsAgentError,
  missionsAgentRequest,
  missionsAgentSuccess,
  bookAgentError,
  bookAgentRequest,
  bookAgentSuccess,
  flushMissionAgents,
} from './request/action';
export {locationError, locationSuccess} from './common/action';
export {
  getMissionsError,
  getMissionsRequest,
  getMissionsSuccess,
  customMissionError,
  customMissionFlush,
  customMissionRequest,
  customMissionSuccess,
} from './missions/action';
export {
  makePaymentError,
  makePaymentRequest,
  makePaymentSuccess,
} from './payments/action';
export {socketConnection, socketDisconnect, socketFlush} from './socket/action';
export {
  getNotificationRequest,
  getNotificationError,
  getNotificationSuccess,
  deleteNotificationError,
  deleteNotificationRequest,
  deleteNotificationSuccess,
} from './notifications/action';
export {
  getChatRequest,
  getChatError,
  getChatSuccess,
  getChatByIdError,
  getChatByIdRequest,
  getChatByIdSuccess,
  operatorChatError,
  operatorChatFlush,
  operatorChatRequest,
  operatorChatSuccess,
} from './messages/action';
export {languageError, languageSuccess} from './language/action';
export {
  getPlanningError,
  getPlanningRequest,
  getPlanningSuccess,
} from './planning/action';

export const resetStore = () => {
  return {
    type: ActionConstants.RESET_STORE,
  };
};
