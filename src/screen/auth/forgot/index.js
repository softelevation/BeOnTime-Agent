import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {Block, Button, CustomButton, Input, Text} from '../../../components';
import Header from '../../../components/common/header';
import {light} from '../../../components/theme/colors';
import {t1, t2, t4, w4} from '../../../components/theme/fontsize';
import {Alerts} from '../../../utils/commonUtils';
import {config} from '../../../utils/config';
import {Formik} from 'formik';
import * as yup from 'yup';

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

  const [loader, setloader] = useState(false);
  const {goBack} = useNavigation();
  const onSubmit = async (values) => {
    setloader(true);
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axios({
      method: 'post',
      url: `${config.Api_Url}/forgot-password`,
      headers,
      data: {
        email: values.email,
      },
    });
    if (response.data.status === 1) {
      setloader(false);
      Alerts('Email has been sent', 'Please check your email', light.success);
      goBack();
    } else {
      setloader(false);
      Alerts('Error', 'Please Enter the correct email address', light.danger);
    }
  };
  return (
    <Block primary>
      <Header centerText="Forgot password" />
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          email: yup.string().email().required(),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          handleSubmit,
          isValid,
          dirty,
        }) => (
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
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                error={touched.email && errors.email}
              />
              <Button
                isLoading={loader}
                disabled={!isValid || !dirty}
                onPress={handleSubmit}
                color="secondary">
                Sent reset email
              </Button>
            </Block>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </Block>
  );
};

export default Forgot;
