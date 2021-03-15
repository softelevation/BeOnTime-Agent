import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  // const {
  //   first_name,
  //   last_name,
  //   email,
  //   password,
  //   phone,
  //   home_address,
  //   customer_type,
  //   company_name = '',
  //   profile,
  // } = data;
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    type,
    iban,
    work_location,
    agent_type,
  } = data;

  var formData = new FormData();
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('home_address', data.address);
  //formData.append('customer_type', customer_type);
  // formData.append('password', '12345678');
  //formData.append('company_name', company_name);
  formData.append('agent_type', agent_type);
  // formData.append('image', data.profile);
  formData.append('iban', iban);
  formData.append('lat', '');
  formData.append('long', '');
  formData.append('work_location_address', work_location);
  formData.append('is_vehicle', data.is_vehicle);
  formData.append('is_subc', data.is_subc);
  formData.append('supplier_company', data.supplier_company);
  // formData.append('social_security_number', data.social_security_number);
  // formData.append('cv', data.cv);
  // formData.append('identity_card', data.identity_card);

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
