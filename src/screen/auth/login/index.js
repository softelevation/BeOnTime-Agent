import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as yup from 'yup';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Input,
  Text,
} from '../../../components';
import Header from '../../../components/common/header';
import {t1, t2, t4, w4} from '../../../components/theme/fontsize';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {loginRequest} from '../../../redux/action';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoad = useSelector((state) => state.user.login.loading);
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

  const onSubmit = async (values) => {
    dispatch(
      loginRequest({
        email: values.email,
        password: values.password,
      }),
    );
  };
  return (
    <Block primary>
      <Header centerText="Login" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={heightPercentageToDP(20)}
        style={{flexGrow: 1}}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().min(8).required(),
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            setFieldValue,
            handleSubmit,
            isValid,
            dirty,
          }) => (
            <>
              <CustomButton onPress={Keyboard.dismiss} flex={0.5} primary />
              <Block padding={[0, w4]} flex={0.5}>
                <Block flex={false} margin={[t1, 0]}>
                  <ImageComponent name="logo" height="50" width="50" />
                </Block>
                <Text size={23} height={30} semibold>
                  Enter profile details
                </Text>
                <Input
                  label="Email address"
                  placeholder={'Enter your email address'}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  error={touched.email && errors.email}
                />
                <Input
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  error={touched.password && errors.password}
                  label="Password"
                  placeholder={'Enter your password'}
                  secureTextEntry={true}
                />

                <Button
                  disabled={!dirty || !isValid}
                  isLoading={isLoad}
                  onPress={handleSubmit}
                  color="secondary">
                  Login
                </Button>
                <CustomButton
                  onPress={() => navigation.navigate('Forgot')}
                  margin={[t1, 0]}>
                  <Text size={18} center semibold>
                    Forgot password
                  </Text>
                </CustomButton>
              </Block>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Block>
  );
};

export default Login;
