import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  return axios({
    method: 'get',
    url: `${config.Api_Url}/profile`,
    headers,
  });
};
export const updateApi = async (data) => {
  const {first_name, last_name, phone, home_address, image} = data;
  var formData = new FormData();

  formData.append('first_name', first_name);
  formData.append('last_name', last_name);

  formData.append('phone', phone);
  formData.append('home_address', home_address);
  formData.append('image', image);

  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/customer/profile`,
    headers,
    data: formData,
  });
};
