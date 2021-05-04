import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../utils/config';
export const chatApi = async () => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'get',
    url: `${config.Api_Url}/agent/message-center`,
    headers,
  });
};
export const chatApiById = async (id) => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'get',
    url: `${config.Api_Url}/agent/message-center/${id}`,
    headers,
  });
};
