import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Block, ImageComponent, Text} from '../../components';
import {
  locationSuccess,
  loginSuccess,
  profileRequest,
} from '../../redux/action';
import {strictValidString} from '../../utils/commonUtils';
import Geolocation from '@react-native-community/geolocation';
import {t4} from '../../components/theme/fontsize';
import messaging from '@react-native-firebase/messaging';

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

  useEffect(() => {
    messaging().onMessage((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log(authStatus);
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log(authStatus, enabled);
    if (enabled) {
      getFcmToken();
      console.log('Authorization status:', authStatus);
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
