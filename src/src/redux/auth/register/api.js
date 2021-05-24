import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  return axios({
    method: 'post',
    url: `${config.Api_Url}/agent/signup`,
    // headers,
    data: data,
  });
};
