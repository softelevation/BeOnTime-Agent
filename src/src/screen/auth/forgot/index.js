import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {Block, Button, CustomButton, Input, Text} from '../../../components';
import Header from '../../../components/common/header';
import {t1, t2, t4, w4} from '../../../components/theme/fontsize';

const Forgot = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <Block primary>
      <Header centerText="Forgot password" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          isKeyboardVisible ? 0 : heightPercentageToDP(10)
        }
        style={{flexGrow: 1}}>
        <CustomButton onPress={Keyboard.dismiss} flex={0.7} primary />
        <Block padding={[0, w4]} flex={0.2}>
          <Text size={20} height={30} semibold>
            Enter email address
          </Text>
          <Text margin={[t1, 0]} grey size={14}>
            Reset instructions will be send to your email.
          </Text>
          <Input
            label="Email address"
            placeholder={'Enter your email address'}
          />
          <Button color="secondary">Sent reset email</Button>
        </Block>
      </KeyboardAvoidingView>
    </Block>
  );
};

export default Forgot;
