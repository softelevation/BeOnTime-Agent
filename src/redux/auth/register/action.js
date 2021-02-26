import {ActionConstants} from '../../constants';

const registerRequest = (payload) => {
  return {
    type: ActionConstants.REGISTER_REQUEST,
    payload:payload,
  };
};
const registerSuccess = (data) => {
//  alert('User Register Succesfully')
  return {
    type: ActionConstants.REGISTER_SUCCESS,
    data,
  };
  
};
const registerError = (error) => {
  return {
    type: ActionConstants.REGISTER_SUCCESS,
    error,
  };
};

export {registerRequest, registerError, registerSuccess};
