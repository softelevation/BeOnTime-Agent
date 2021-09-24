import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../utils/config';

export const Api = async (data) => {
  const token = await AsyncStorage.getItem('token');
  const language = await AsyncStorage.getItem('language');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
    language: language,
  };
  return axios({
    method: 'GET',
    url: `${config.Api_Url}/agent/agent-schedule-date`,
    headers,
  });
};
export const SaveScheduleApi = async (data) => {
  const token = await AsyncStorage.getItem('token');
  const language = await AsyncStorage.getItem('language');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
    language: language,
  };
  return axios({
    method: 'POST',
    url: `${config.Api_Url}/agent/agent-schedule-date`,
    headers,
    data: data,
  });
};
