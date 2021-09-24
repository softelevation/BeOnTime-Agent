import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  const language = await AsyncStorage.getItem('language');
  const headers = {
    'Content-Type': 'application/json',
    language: language,
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/agent/signup`,
    headers,
    data: data,
  });
};
