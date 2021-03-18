import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  console.log(data, 'data');
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    type,
    iban,
    work_location_address,
    agent_type,
    lat,
    long,
    social_security_number,
    supplier_company,
    is_subc,
    is_vehicle,
  } = data;

  var formData = new FormData();
  formData.append('first_name', first_name);
  formData.append('last_name', last_name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('home_address', address);
  formData.append('agent_type', agent_type);
  formData.append('iban', iban);
  formData.append('lat', lat);
  formData.append('long', long);
  formData.append('work_location_address', work_location_address);
  formData.append('is_vehicle', is_vehicle);
  formData.append('is_subc', is_subc);
  formData.append('supplier_company', supplier_company);
  formData.append('social_security_number', social_security_number);

  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/agent/signup`,
    // headers,
    data: formData,
  });
};
