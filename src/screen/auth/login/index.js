import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as yup from 'yup';
import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
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
import {t1, t4, w4} from '../../../components/theme/fontsize';

import {useDispatch, useSelector} from 'react-redux';
import {loginRequest} from '../../../redux/action';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoad = useSelector((state) => state.user.login.loading);
  const languageMode = useSelector((state) => state.languageReducer.language);

  const {
    Password,
    EmailAddress,
    EnterPassword,
    EnterProfileDetails,
    EnterEmail,
    ForgotPassword,
    LoginHeaderTop,
    type,
  } = languageMode;
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
        role_id: 2,
        language: type,
      }),
    );
  };
  return (
    <Block primary>
      <Header centerText={LoginHeaderTop} />
      <KeyboardAwareScrollView
        contentContainerStyle={[
          isKeyboardVisible ? {bottom: heightPercentageToDP(3)} : {bottom: 0},
          {flexGrow: 1, justifyContent: 'flex-end'},
        ]}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().min(6).required(),
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
              <Block bottom padding={[0, w4, t4]}>
                <Text size={23} height={30} semibold>
                  {EnterProfileDetails}
                </Text>
                <Input
                  label={EmailAddress}
                  placeholder={EnterEmail}
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
                  label={Password}
                  placeholder={EnterPassword}
                  secureTextEntry={true}
                />

                <Button
                  disabled={!dirty || !isValid}
                  isLoading={isLoad}
                  onPress={handleSubmit}
                  color="secondary">
                  {LoginHeaderTop}
                </Button>
                <CustomButton
                  onPress={() => navigation.navigate('Forgot')}
                  margin={[t1, 0]}>
                  <Text size={18} center semibold>
                    {ForgotPassword}
                  </Text>
                </CustomButton>
              </Block>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default Login;
