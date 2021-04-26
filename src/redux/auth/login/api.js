import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import {config} from '../../../utils/config';

export const Api = async (data) => {
  const fcmToken = await messaging().getToken();

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
      device_token: fcmToken,
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
