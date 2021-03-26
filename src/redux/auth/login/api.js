import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  const {email, password, role_id} = data;
  const headers = {
    'Content-Type': 'application/json',
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/login`,
    headers,
    data: {
      email: `${email}`,
      password: `${password}`,
      role_id: role_id,
    },
  });
};
export const updatePasswordApi = async (data) => {
  const token = await AsyncStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/change-password`,
    headers,
    data: data,
  });
};
