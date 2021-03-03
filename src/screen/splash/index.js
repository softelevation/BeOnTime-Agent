import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Block, ImageComponent} from '../../components';
import {loginSuccess} from '../../redux/action';
import {strictValidString} from '../../utils/commonUtils';

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const callAuthApi = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    console.log("token==>>>",token);
    if (strictValidString(token)) {
      dispatch(loginSuccess(parsedUser));
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Block primary center middle>
      <ImageComponent name="logo" height="170" width="170" />
    </Block>
  );
};

export default Splash;
