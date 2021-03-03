import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../utils/config';
export const Api = async (data) => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'get',
    url: `${config.Api_Url}/customer/my-mission-list`,
    headers,
    data: data,
  });
};
