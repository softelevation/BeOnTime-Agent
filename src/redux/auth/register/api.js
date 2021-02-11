import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    home_address,
    customer_type,
    company_name = '',
    profile,
  } = data;
  var formData = new FormData();
  formData.append('first_name', first_name);
  formData.append('last_name', last_name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('home_address', home_address);
  formData.append('customer_type', customer_type);
  formData.append('password', password);
  formData.append('company_name', company_name);
  formData.append('image', JSON.stringify(profile));
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/customer/signup`,
    // headers,
    data: formData,
  });
};
