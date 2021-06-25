import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Block, ImageComponent, Text} from '../../components';
import {
  languageSuccess,
  locationSuccess,
  loginSuccess,
  profileRequest,
  socketConnection,
} from '../../redux/action';
import {strictValidString} from '../../utils/commonUtils';
import {io} from 'socket.io-client';
import Geolocation from '@react-native-community/geolocation';
import {t4} from '../../components/theme/fontsize';
import messaging from '@react-native-firebase/messaging';
import {config} from '../../utils/config';
import {en, fr} from '../common/language';
import {PermissionsAndroid, Platform} from 'react-native';

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        dispatch(locationSuccess(position.coords));
      },
      (error) => {},
      {
        enableHighAccuracy: false,
        timeout: 15000,
      },
    );
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'BeOnTime App Location Permission',
          message:
            'BeOnTime App App needs access to your location ' +
            'so you can access the geolocation service.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getLocation();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      requestCameraPermission();
    }
    getLanguageValue();
  }, []);

  const getLanguageValue = async () => {
    let value = '';
    try {
      value = (await AsyncStorage.getItem('language')) || 'none';
    } catch (error) {
      // Error retrieving data
    }
    if (value === 'en') {
      dispatch(languageSuccess(en));
    } else {
      dispatch(languageSuccess(fr));
    }
  };

  const callAuthApi = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    if (strictValidString(token)) {
      dispatch(loginSuccess(parsedUser));
      dispatch(profileRequest());

      setTimeout(() => {
        navigation.reset({
          routes: [{name: 'Home'}],
        });
      }, 3000);
    } else {
      setTimeout(() => {
        navigation.reset({
          routes: [{name: 'Auth'}],
        });
      }, 3000);
    }
  };
  useEffect(() => {
    requestUserPermission();
    callAuthApi();
    const socket = io(config.Api_Url);
    socket.on('connect', (a) => {
      dispatch(socketConnection(socket));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
    }
  };
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  return (
    <Block primary center middle>
      <ImageComponent name="logo" height="170" width="170" />
      <Text size={28} margin={[t4, 0, 0]} bold>
        BE ON TIME
      </Text>
    </Block>
  );
};

export default Splash;
