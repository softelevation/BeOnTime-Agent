import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../utils/config';
export const Api = async () => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'get',
    url: `${config.Api_Url}/agent/mission-requests`,
    headers,
  });
};

export const SearchApi = async (data) => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/customer/quick-create-mission`,
    headers,
    data: data,
  });
};
export const MissionAgentsApi = async (data) => {
  const {mission_id} = data;
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/customer/available-agents`,
    headers,
    data: {
      mission_id: mission_id,
    },
  });
};
export const BookAgentsApi = async (data) => {
  const {agent_id, mission_id} = data;
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/customer/book-now`,
    headers,
    data: {
      agent_id: agent_id,
      mission_id: mission_id,
    },
  });
};
