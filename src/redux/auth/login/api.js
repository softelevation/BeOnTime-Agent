import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
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
    },
  });
};
