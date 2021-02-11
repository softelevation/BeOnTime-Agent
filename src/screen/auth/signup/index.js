import {Formik} from 'formik';
import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {images} from '../../../assets';
import {
  Block,
  CustomButton,
  Input,
  Text,
  ImageComponent,
  Checkbox,
  Button,
} from '../../../components';
import Header from '../../../components/common/header';
import {t1, t2, t4, w1, w3, w4} from '../../../components/theme/fontsize';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {loginRequest, registerRequest} from '../../../redux/action';
import AlertCompnent from '../../../components/AlertCompnent';

const Signup = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const loading = useSelector((state) => state.user.register.loading);
  const isLoad = useSelector((state) => state.user.login.loading);
  const isSuccess = useSelector((state) => state.user.register.isSuccess);
  const dispatch = useDispatch();
  const [modal, setmodal] = useState(false);
  const [userProfileDetails, setUserDetails] = useState({
    profileImage: '',
    uploading: false,
    profileData: '',
  });
  const {profileImage, profileData, uploading} = userProfileDetails;

  useEffect(() => {
    if (isSuccess) {
      setmodal(true);
    }
  }, [isSuccess]);

  const uploadPhoto = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setUserDetails({
        ...userProfileDetails,
        uploading: true,
      });
      console.log(image, 'image');
      const uri = image.path;
      const uriParts = uri.split('.');
      const filename = uriParts[uriParts.length - 1];
      // {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'}
      setTimeout(() => {
        setUserDetails({
          ...userProfileDetails,
          uploading: false,
          profileImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
          profileData: {
            name: image.filename ? image.filename : `photo.${filename}`,
            type: image.mime,
            uri:
              Platform.OS === 'ios'
                ? image.sourceURL
                : image.path.replace('file://', ''),
          },
        });
      }, 2000);
    });
  };
  console.log(userProfileDetails, 'userProfileDetails');
  const renderProfileImagePath = () => {
    if (profileImage) {
      return {uri: profileImage};
    }
    return images.default_profile_icon;
  };
  const renderProfileImage = () => {
    if (uploading) {
      return (
        <ActivityIndicator size="large" color="#000" style={LoaderStyle} />
      );
    }
    if (!uploading) {
      return (
        <>
          <ImageBackground
            source={renderProfileImagePath()}
            imageStyle={{borderRadius: 80}}
            style={BackgroundStyle}>
            <TouchableOpacity onPress={() => uploadPhoto()}>
              <ImageComponent name="plus_icon" height="55" width="55" />
            </TouchableOpacity>
          </ImageBackground>
        </>
      );
    }
  };
  const onLogin = () => {
    // setmodal(true);
    if (formikRef.current) {
      const {email, password} = formikRef.current.values;
      dispatch(
        loginRequest({
          email: email,
          password: password,
        }),
      );
      setmodal(false);
    }
  };
  const onSubmit = (values) => {
    console.log(values);
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      type,
      password,
      company,
    } = values;

    const data = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      home_address: address,
      customer_type: type === 'company' ? 2 : 1,
      password: password,
      company_name: company,
      profile: profileData,
    };

    dispatch(registerRequest(data));
  };
  return (
    <Block primary>
      <Header centerText="Get Started" />
      <Block padding={[t1, 0]} flex={false} color="#000">
        <Text white size={14} semibold center>
          ALL FIELDS ARE MANDATORY
        </Text>
      </Block>
      <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: t4}}>
        {renderProfileImage()}
        <Formik
          innerRef={formikRef}
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirm_password: '',
            address: '',
            company: '',
            type: 'individual',
            privacy: false,
            terms: false,
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            firstName: yup.string().min(1).required(),
            lastName: yup.string().min(1).required(),
            email: yup.string().email().required(),
            phone: yup.string().min(10).required(),
            password: yup.string().min(8).required(),
            address: yup.string().min(3).required(),
            terms: yup
              .bool()
              .oneOf([true], 'Accept Terms & Conditions is required'),
            privacy: yup
              .bool()
              .oneOf([true], 'Accept Privacy Policy is required'),
            confirm_password: yup
              .string()
              .when('password', {
                is: (val) => (val && val.length > 0 ? true : false),
                then: yup
                  .string()
                  .oneOf(
                    [yup.ref('password')],
                    'Both password need to be the same',
                  ),
              })
              .required(),
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            setFieldValue,
            handleSubmit,
            dirty,
            isValid,
          }) => (
            <>
              <Block flex={false} padding={[0, w3]}>
                <Input
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={() => setFieldTouched('firstName')}
                  error={touched.firstName && errors.firstName}
                  label="First Name"
                  placeholder="Enter first name"
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={() => setFieldTouched('lastName')}
                  error={touched.lastName && errors.lastName}
                />
                <Input
                  label="Email address"
                  placeholder="Enter email address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  error={touched.email && errors.email}
                />
                <Input
                  label="Phone number"
                  placeholder="Enter phone number"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={() => setFieldTouched('phone')}
                  error={touched.phone && errors.phone}
                />
                <Input
                  label="Password"
                  placeholder="Enter password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  error={touched.password && errors.password}
                  secureTextEntry={true}
                />
                <Input
                  label="Confirm password"
                  placeholder="Confirm password"
                  value={values.confirm_password}
                  onChangeText={handleChange('confirm_password')}
                  onBlur={() => setFieldTouched('confirm_password')}
                  error={touched.confirm_password && errors.confirm_password}
                  secureTextEntry={true}
                />
                <Input
                  label="Home address"
                  placeholder="Enter home address"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={() => setFieldTouched('address')}
                  error={touched.address && errors.address}
                />
              </Block>
              <Block center margin={[0, w3]} row flex={false}>
                <Text
                  size={16}
                  style={{width: widthPercentageToDP(45)}}
                  regular>
                  Are you an individual or company?
                </Text>

                <Block
                  primary
                  padding={[t1]}
                  margin={[0, w4]}
                  color={'#F7F8FA'}
                  borderRadius={30}
                  row
                  flex={false}>
                  <CustomButton
                    onPress={() => setFieldValue('type', 'individual')}
                    center
                    middle
                    borderRadius={30}
                    padding={
                      values.type === 'individual'
                        ? [heightPercentageToDP(1.5)]
                        : [0, heightPercentageToDP(1.5)]
                    }
                    color={values.type === 'individual' ? '#FFFFFF' : '#F7F8FA'}
                    shadow={values.type === 'individual'}
                    margin={[0, w1]}>
                    <Text size={14} semibold>
                      Individual
                    </Text>
                  </CustomButton>
                  <CustomButton
                    onPress={() => setFieldValue('type', 'company')}
                    center
                    middle
                    borderRadius={20}
                    padding={
                      values.type === 'company'
                        ? [heightPercentageToDP(1.5)]
                        : [
                            0,
                            widthPercentageToDP(1.5),
                            0,
                            widthPercentageToDP(1.5),
                          ]
                    }
                    color={values.type === 'company' ? '#FFFFFF' : '#F7F8FA'}
                    shadow={values.type === 'company'}>
                    <Text size={14} semibold>
                      Company
                    </Text>
                  </CustomButton>
                </Block>
              </Block>
              <Block flex={false} padding={[0, w3]}>
                {values.type === 'company' && (
                  <Input
                    label="Company name"
                    placeholder="Enter company name"
                    value={values.company}
                    onChangeText={handleChange('company')}
                    onBlur={() => setFieldTouched('company')}
                    error={touched.company && errors.company}
                  />
                )}
                <Block row center>
                  <Checkbox
                    onChange={() => setFieldValue('privacy', !values.privacy)}
                    checkboxStyle={{height: 25, width: 25}}
                    label=""
                    checked={values.privacy}
                  />
                  <Text size={16}>
                    I accept{' '}
                    <Text style={{textDecorationLine: 'underline'}} size={16}>
                      Privacy Policy.
                    </Text>
                  </Text>
                </Block>
                <Block margin={[t1, 0]} row center>
                  <Checkbox
                    onChange={() => setFieldValue('terms', !values.terms)}
                    checkboxStyle={{height: 25, width: 25}}
                    label=""
                    checked={values.terms}
                  />
                  <Text size={16}>
                    I accept{' '}
                    <Text style={{textDecorationLine: 'underline'}} size={16}>
                      Terms & Conditions.
                    </Text>
                  </Text>
                </Block>
                <Button
                  disabled={!isValid || !dirty}
                  isLoading={loading}
                  onPress={handleSubmit}
                  style={{marginTop: t2}}
                  color="secondary">
                  Finish registration
                </Button>
              </Block>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
      <AlertCompnent
        visible={modal}
        title={'Registration Success !'}
        description="Welcome to BeOnTime."
        buttonTitle="Search for Agents"
        onPress={() => onLogin()}
        isLoading={isLoad}
        onRequestClose={() => setmodal(false)}
      />
    </Block>
  );
};
const BackgroundStyle = {
  height: 120,
  width: 120,
  alignSelf: 'center',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  marginVertical: heightPercentageToDP(2),
};
const LoaderStyle = {
  height: 120,
  width: 120,
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: heightPercentageToDP(2),
};

export default Signup;
