import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Block, ImageComponent} from '../../components';
import {
  locationSuccess,
  loginSuccess,
  profileRequest,
  socketConnection,
} from '../../redux/action';
import {strictValidString} from '../../utils/commonUtils';
import io from 'socket.io-client';
import Geolocation from '@react-native-community/geolocation';

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const watchId = Geolocation.getCurrentPosition(
      (position) => {
        dispatch(locationSuccess(position.coords));
      },
      (error) => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  const callAuthApi = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    if (strictValidString(token)) {
      dispatch(loginSuccess(parsedUser));
      dispatch(profileRequest());

      setTimeout(() => {
        navigation.navigate('Home');
      }, 3000);
    } else {
      setTimeout(() => {
        navigation.navigate('Auth');
      }, 3000);
    }
  };
  useEffect(() => {
    callAuthApi();
    const socket = io('http://51.68.139.99:3000');
    console.log('Connecting socket...');
    socket.on('connect', (a) => {
      dispatch(socketConnection(socket));
      console.log('true', socket.connected); // true
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Block primary center middle>
      <ImageComponent name="logo" height="170" width="170" />
    </Block>
  );
};

export default Splash;
