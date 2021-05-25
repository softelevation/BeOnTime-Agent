import {Formik} from 'formik';
import React, {useState, useEffect, useRef} from 'react';
import Toast from 'react-native-simple-toast';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
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
import {t1, t2, t4, w1, w2, w3, w4} from '../../../components/theme/fontsize';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {loginRequest, registerRequest} from '../../../redux/action';
import AgentType from './agent-type';
import ImagePicker from './imagePicker';
import {Modalize} from 'react-native-modalize';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
} from '../../../utils/commonUtils';
import GooglePlacesTextInput from '../../../components/googlePlaces';
import {config} from '../../../utils/config';
import AsyncStorage from '@react-native-community/async-storage';
import {UPLOAD, uploadMedia} from '../../../utils/site-specific-common-utils';
import {styles} from '../../../utils/common-styles';
import Modal from 'react-native-modal';

const imageData = {
  profileUrl: {},
  identityUrl: {},
  socialUrl: {},
  acvUrl: {},
};
const userProfileData = {
  profileImage: '',
  uploading: false,
  profileData: '',
};
const IdentityCardData = {
  idCardImage: '',
  uploadings: false,
  idCardData: '',
};
const ACVCardData = {
  AcvCardImage: '',
  uploadingss: false,
  AcvCardData: '',
};
const SocialSecurityData = {
  socialSecImage: '',
  uploadingSS: false,
  socialSecData: '',
};

const Signup = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const loading = useSelector((state) => state.user.register.loading);
  const isLoad = useSelector((state) => state.user.login.loading);
  const isSuccess = useSelector((state) => state.user.register.isSuccess);
  const location = useSelector((state) => state.common.location.data);
  const modalizeRef = useRef();
  const dispatch = useDispatch();
  const [action, setAction] = useState('');
  const [modal, setmodal] = useState(false);
  // Profile State
  const [userProfileDetails, setUserDetails] = useState(userProfileData);
  const {profileImage, uploading} = userProfileDetails;
  // Identity Card State
  const [userIDCardDetails, setUserIDCardDetails] = useState(IdentityCardData);
  const {idCardImage, uploadings} = userIDCardDetails;
  // ACV Card State
  const [userAcvCardDetails, setUserAcvCardDetails] = useState(ACVCardData);
  const {AcvCardImage, uploadingss} = userAcvCardDetails;
  // Social Security State
  const [userSocialSec, setUserSocialSec] = useState(SocialSecurityData);
  const {socialSecImage, uploadingSS} = userSocialSec;
  // Url's of Image
  const [docData, setDocData] = useState(imageData);
  const {profileUrl, identityUrl, socialUrl, acvUrl} = docData;

  console.log(docData, 'docData');

  const uploadPhoto = (type) => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async (image) => {
      setUserDetails({
        ...userProfileDetails,
        uploading: true,
      });
      const uri = image.path;
      const uriParts = uri.split('.');
      const filename = uriParts[uriParts.length - 1];
      setUserDetails({
        ...userProfileDetails,
        uploading: true,
        profileImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
      });
      const res = await UPLOAD(
        '',
        image.filename ? image.filename : `photo.${filename}`,
        Platform.OS === 'ios'
          ? image.sourceURL
          : image.path.replace('file://', ''),
        image.mime,
        'image',
      );
      if (res) {
        setUserDetails({
          ...userProfileDetails,
          uploading: false,
          profileImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
        });
        setDocData({
          ...docData,
          profileUrl: JSON.parse(res.data),
        });
      }
    });
  };

  const uploadDocumentIdCard = async (type) => {
    if (type === 'gallary') {
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async (image) => {
        setUserIDCardDetails({
          ...userIDCardDetails,
          uploading: true,
        });
        const uri = image.path;
        const uriParts = uri.split('.');
        const filename = uriParts[uriParts.length - 1];
        console.log(image, 'image');
        // {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'}
        setUserIDCardDetails({
          ...userIDCardDetails,
          uploadings: false,
          idCardImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
        });
        const res = await UPLOAD(
          '',
          image.filename ? image.filename : `photo.${filename}`,
          Platform.OS === 'ios'
            ? image.sourceURL
            : image.path.replace('file://', ''),
          image.mime,
          'identity_card',
        );
        if (res) {
          setDocData({
            ...docData,
            identityUrl: JSON.parse(res.data),
          });
        }
      });
    } else {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async (image) => {
        setUserIDCardDetails({
          ...userIDCardDetails,
          uploading: true,
        });
        const uri = image.path;
        const uriParts = uri.split('.');
        const filename = uriParts[uriParts.length - 1];
        // {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'}
        setUserIDCardDetails({
          ...userIDCardDetails,
          uploadings: false,
          idCardImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
        });
        const res = await UPLOAD(
          '',
          image.filename ? image.filename : `photo.${filename}`,
          Platform.OS === 'ios'
            ? image.sourceURL
            : image.path.replace('file://', ''),
          image.mime,
          'identity_card',
        );
        if (res) {
          setDocData({
            ...docData,
            identityUrl: JSON.parse(res.data),
          });
        }
      });
    }
  };

  const uploadDocumentAcv = async (type) => {
    if (type === 'gallary') {
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async (image) => {
        setUserAcvCardDetails({
          ...userAcvCardDetails,
          uploadingss: true,
        });
        const uri = image.path;
        const uriParts = uri.split('.');
        const filename = uriParts[uriParts.length - 1];
        // {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'}
        setUserAcvCardDetails({
          ...userAcvCardDetails,
          uploadingss: false,
          AcvCardImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
        });
        const res = await UPLOAD(
          '',
          image.filename ? image.filename : `photo.${filename}`,
          Platform.OS === 'ios'
            ? image.sourceURL
            : image.path.replace('file://', ''),
          image.mime,
          'cv',
        );
        console.log(res, 'res');
        if (res) {
          setDocData({
            ...docData,
            acvUrl: JSON.parse(res.data),
          });
        }
      });
    } else {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async (image) => {
        setUserAcvCardDetails({
          ...userIDCardDetails,
          uploading: true,
        });
        const uri = image.path;
        const uriParts = uri.split('.');
        const filename = uriParts[uriParts.length - 1];
        // {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'}
        setUserAcvCardDetails({
          ...userAcvCardDetails,
          uploadings: false,
          AcvCardImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
        });
        console.log(
          '',
          image.filename ? image.filename : `photo.${filename}`,
          Platform.OS === 'ios'
            ? image.sourceURL
            : image.path.replace('file://', ''),
          image.mime,
          'cv',
        );
        const res = await UPLOAD(
          '',
          image.filename ? image.filename : `photo.${filename}`,
          Platform.OS === 'ios'
            ? image.sourceURL
            : image.path.replace('file://', ''),
          image.mime,
          'cv',
        );
        console.log(res, 'res');
        if (res) {
          setDocData({
            ...docData,
            acvUrl: JSON.parse(res.data),
          });
        }
      });
    }
  };

  const uploadDocumentSocial = async (type) => {
    if (type === 'gallary') {
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async (image) => {
        setUserSocialSec({
          ...userIDCardDetails,
          uploading: true,
        });

        const uri = image.path;
        const uriParts = uri.split('.');
        const filename = uriParts[uriParts.length - 1];
        // {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'}
        setTimeout(() => {
          setUserSocialSec({
            ...userSocialSec,
            uploadings: false,
            socialSecImage:
              Platform.OS === 'ios' ? image.sourceURL : image.path,
          });
        }, 2000);
        const res = await UPLOAD(
          '',
          image.filename ? image.filename : `photo.${filename}`,
          Platform.OS === 'ios'
            ? image.sourceURL
            : image.path.replace('file://', ''),
          image.mime,
          'social_security_number',
        );
        if (res) {
          setDocData({
            ...docData,
            socialUrl: JSON.parse(res.data),
          });
        }
      });
    } else {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async (image) => {
        setUserSocialSec({
          ...userSocialSec,
          uploading: true,
        });
        const uri = image.path;
        const uriParts = uri.split('.');
        const filename = uriParts[uriParts.length - 1];
        // {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'}
        setTimeout(() => {
          setUserSocialSec({
            ...userAcvCardDetails,
            uploadings: false,
            socialSecImage:
              Platform.OS === 'ios' ? image.sourceURL : image.path,
          });
        }, 2000);

        const res = await UPLOAD(
          '',
          image.filename ? image.filename : `photo.${filename}`,
          Platform.OS === 'ios'
            ? image.sourceURL
            : image.path.replace('file://', ''),
          image.mime,
          'social_security_number',
        );
        if (res) {
          setDocData({
            ...docData,
            socialUrl: JSON.parse(res.data),
          });
        }
      });
    }
  };
  console.log(userAcvCardDetails, 'userAcvCardDetails');

  const renderProfileImagePath = () => {
    if (profileImage) {
      return {uri: profileImage};
    }
    return images.default_profile_icon;
  };

  const renderIdCardImage = () => {
    if (idCardImage) {
      return {uri: idCardImage};
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

  const renderIdCardImageDoc = () => {
    if (uploadings) {
      return (
        <ActivityIndicator size="large" color="#000" style={LoaderStyle} />
      );
    }
    if (!uploadings) {
      return (
        <>
          <ImageBackground
            source={renderIdCardImage()}
            imageStyle={{borderRadius: 80}}
            style={BackgroundStyle}
          />
        </>
      );
    }
  };
  const renderAcvImagePath = () => {
    if (AcvCardImage) {
      return {uri: AcvCardImage};
    }
    return images.default_profile_icon;
  };

  const renderAcvCardImage = () => {
    if (uploading) {
      return (
        <ActivityIndicator size="large" color="#000" style={LoaderStyle} />
      );
    }
    if (!uploading) {
      return (
        <>
          <ImageBackground
            source={renderAcvImagePath()}
            imageStyle={{borderRadius: 80}}
            style={BackgroundStyle}>
            {/* <TouchableOpacity onPress={() => uploadPhoto()}>
              <ImageComponent name="plus_icon" height="55" width="55" />
            </TouchableOpacity> */}
          </ImageBackground>
        </>
      );
    }
  };

  const renderSocialSecImagePath = () => {
    if (socialSecImage) {
      return {uri: socialSecImage};
    }
    return images.default_profile_icon;
  };

  const renderSocialSecImage = () => {
    if (uploadingSS) {
      return (
        <ActivityIndicator size="large" color="#000" style={LoaderStyle} />
      );
    }
    if (!uploadingSS) {
      return (
        <>
          <ImageBackground
            source={renderSocialSecImagePath()}
            imageStyle={{borderRadius: 80}}
            style={BackgroundStyle}>
            {/* <TouchableOpacity onPress={() => uploadPhoto()}>
              <ImageComponent name="plus_icon" height="55" width="55" />
            </TouchableOpacity> */}
          </ImageBackground>
        </>
      );
    }
  };

  const onLogin = () => {
    // setmodal(true);
    // if (formikRef.current) {
    //   const { email, password } = formikRef.current.values;
    //   dispatch(
    //     loginRequest({
    //       email: email,
    //       password: password,
    //     }),
    //   );
    //   setmodal(false);
    // }
    setmodal(false);
  };
  const onSubmit = (values) => {
    const agentTypeArray = [];
    values.agent_type.map((v) => {
      agentTypeArray.push(v.value);
    });
    console.log(agentTypeArray, 'agentTypeArray');
    if (values.firstName === '') {
      Toast.show('Please Enter First Name');
    } else if (values.lastName === '') {
      Toast.show('Please Enter Last  Name');
    } else if (values.email === '') {
      Toast.show('Please enter email');
    } else if (values.phone === '') {
      Toast.show('Please enter phone number');
    }
    // else if (idCardData === '') {
    //   Toast.show('Please Upload Identity Card Document')
    // }
    // else if (AcvCardData === '') {
    //   Toast.show('Please Upload Anonymous Curriculum Vitae document')
    // }
    // else if (socialSecData === '') {
    //   Toast.show('Please Upload Social Security Number document')
    // }
    else if (values.iban === '') {
      Toast.show('Please enter IBAN number');
    } else if (values.cnaps === '') {
      Toast.show('Please enter CNAPS Number');
    } else if (values.address === '') {
      Toast.show('Please Enter Home Address');
    } else if (values.work_location === '') {
      Toast.show('Please Enter Work Location Address');
    } else if (values.company === '') {
      Toast.show('Please Enter Company Name');
    } else if (values.privacy === false) {
      Toast.show('Please accept Privacy Policy');
    } else if (values.terms === false) {
      Toast.show('Please accept Terms');
    } else {
      const {
        firstName,
        lastName,
        email,
        phone,
        address,
        iban,
        work_location,
        company,
        lat,
        lng,
        cnaps,
      } = values;

      const data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        iban: iban,
        home_address: address,
        work_location_address: work_location,
        lat: lat,
        long: lng,
        is_vehicle: values.typeVehicle === 'yes' ? 1 : 0,
        is_subc: values.typeContractor === 'yes' ? 1 : 0,
        supplier_company: company,
        identity_card: strictValidObjectWithKeys(identityUrl)
          ? identityUrl.value
          : '',
        social_security_number: strictValidObjectWithKeys(identityUrl)
          ? identityUrl.value
          : '',
        cv: strictValidObjectWithKeys(identityUrl) ? identityUrl.value : '',
        agent_type: agentTypeArray,
        cnaps_number: cnaps,
      };

      console.log('====>>>>>>>', data);

      dispatch(registerRequest(data));

      // uploadDocument(profileData, idCardData, socialSecData, AcvCardData);
    }
  };

  const onOpen = (type) => {
    modalizeRef.current?.open();
    setAction(type);
  };
  const onClose = (type) => {
    modalizeRef.current?.close();
    setAction('');
  };

  const renderType = (label, description, onPress, value) => {
    return (
      <CustomButton
        onPress={onPress}
        margin={[t1, 0]}
        borderWidth={1}
        borderColor={'#F5F7FA'}
        flex={false}
        space={'between'}
        padding={[t1]}
        center
        row>
        <Block flex={false}>
          <Text color="#8A8E99" caption>
            {label}
          </Text>
          <Text bold color="#8A8E99" margin={[t1, 0, 0, 0]} size={16}>
            {value || description}
          </Text>
        </Block>
        <ImageComponent name="down_arrow_icon" height="8" width="14" />
      </CustomButton>
    );
  };
  const renderFiles = (label, description, onPress, value) => {
    return (
      <CustomButton
        onPress={onPress}
        margin={[t1, 0]}
        borderWidth={1}
        borderColor={'#F5F7FA'}
        flex={false}
        space={'between'}
        padding={[t1]}
        center
        row>
        <Block flex={false}>
          <Text color="#8A8E99" caption>
            {label}
          </Text>
          <Text bold color="#8A8E99" margin={[t1, 0, 0, 0]} size={16}>
            {value || description}
          </Text>
        </Block>
        <ImageComponent name="document_icon" height="16" width="14" />
      </CustomButton>
    );
  };
  const renderAgentType = (label, description, onPress, value) => {
    return (
      <CustomButton
        onPress={onPress}
        margin={[t1, 0]}
        borderWidth={1}
        borderColor={'#F5F7FA'}
        flex={false}
        space={'between'}
        padding={[t1]}
        center
        row>
        <Block flex={false}>
          <Text color="#8A8E99" caption>
            {label}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: widthPercentageToDP(80),
            }}>
            {strictValidArrayWithLength(value) ? (
              value.map((a, index) => {
                return (
                  <Text bold color="#8A8E99" margin={[t1, 0, 0, 0]} size={16}>
                    {value.length - 1 === index ? `${a.name}` : `${a.name},`}
                  </Text>
                );
              })
            ) : (
              <Text bold color="#8A8E99" size={16} margin={[t1, 0, 0, 0]}>
                {description}
              </Text>
            )}
          </View>
        </Block>
        <ImageComponent name="down_arrow_icon" height="8" width="14" />
      </CustomButton>
    );
  };

  return (
    <Block primary>
      <Header centerText="Get Started" />
      <Block padding={[t1, 0]} flex={false} color="#000">
        <Text white size={14} semibold center>
          ALL FIELDS ARE MANDATORY
        </Text>
      </Block>

      {renderProfileImage()}
      <Formik
        innerRef={formikRef}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          // password: '',
          //confirm_password: '',
          address: '',
          company: '',
          type: 'individual',
          privacy: false,
          terms: false,
          agent_type: [],
          iban: '',
          cnaps: '',
          work_location: '',
          company: '',
          identy_card: 'Please Upload Document',
          Acv: 'Please Upload Document',
          Ssn: 'Please Upload Document',
          typeVehicle: 'no',
          typeContractor: 'no',
          lat: '',
          lng: '',
        }}
        onSubmit={onSubmit}>
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
        }) => {
          return (
            <>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{paddingBottom: t4}}>
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
                    blurOnSubmit={false}
                    autoCorrect={false}
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
                  {renderAgentType(
                    'Agent type',
                    'Select agent type',
                    () => onOpen('agent'),
                    values.agent_type,
                  )}
                  {renderFiles(
                    'Identity Card',
                    'Please Upload document',
                    () => onOpen('identry_card'),
                    idCardImage ? '1 file selected' : values.identy_card,
                  )}
                  {renderFiles(
                    'Anonymous Curriculum Vitae',
                    'Please Upload document',
                    () => onOpen('Acv'),
                    AcvCardImage ? '1 file selected' : values.Acv,
                  )}
                  {/* {renderFiles('Anonymous Curriculum Vitae')} */}
                  {/* {renderFiles('Social Security Number')} */}
                  {renderFiles(
                    'Social Security Number',
                    'Please Upload document',
                    () => onOpen('Ssn'),
                    socialSecImage ? '1 file selected' : values.Acv,
                  )}
                  <Input
                    label="IBAN Info"
                    placeholder="Enter IBAN Info"
                    value={values.iban}
                    onChangeText={handleChange('iban')}
                    onBlur={() => setFieldTouched('iban')}
                    error={touched.iban && errors.iban}
                  />
                  <Input
                    label="CNAPS Number"
                    placeholder="Enter CNAPS Number"
                    value={values.cnaps}
                    onChangeText={handleChange('cnaps')}
                    onBlur={() => setFieldTouched('cnaps')}
                    error={touched.cnaps && errors.cnaps}
                  />
                  <View style={{marginTop: t1}}>
                    <GooglePlacesTextInput
                      placeholder="Enter home address"
                      label="Home address"
                      value={values.address}
                      onPress={(data, details) => {
                        const latlng = details.geometry.location;
                        const description = data.description;
                        setFieldValue('address', description);
                      }}
                      error={touched.address && errors.address}
                      textInputProps={{
                        placeholderTextColor: '#8A8E99',
                        onblur: () => setFieldTouched('address'),
                        value: values.address,
                        onChangeText: handleChange('address'),
                      }}
                    />
                  </View>
                  <View style={{marginTop: t2}}>
                    <GooglePlacesTextInput
                      label="Work Location"
                      placeholder="Work Location"
                      value={values.work_location}
                      onPress={(data, details) => {
                        const latlng = details.geometry.location;
                        const description = data.description;
                        setFieldValue('work_location', description);
                        setFieldValue('lat', latlng.lat);
                        setFieldValue('lng', latlng.lng);
                      }}
                      error={touched.work_location && errors.work_location}
                      textInputProps={{
                        placeholderTextColor: '#8A8E99',
                        onblur: () => setFieldTouched('work_location'),
                        value: values.work_location,
                        onChangeText: handleChange('work_location'),
                      }}
                    />
                  </View>
                  {/* <Input
                  label="Home address"
                  placeholder="Enter home address"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={() => setFieldTouched('address')}
                  error={touched.address && errors.address}
                />
                <Input
                  label="Work Location"
                  placeholder="Work Location"
                  value={values.work_location}
                  onChangeText={handleChange('work_location')}
                  onBlur={() => setFieldTouched('work_location')}
                  error={touched.work_location && errors.work_location}
                /> */}
                </Block>
                <Block flex={false} padding={[0, w2]}>
                  <Block
                    // space={'between'}
                    center
                    margin={[t1, w1]}
                    row
                    flex={false}>
                    <Text
                      size={16}
                      style={{width: widthPercentageToDP(40)}}
                      regular>
                      Do you possess a vehicle?
                    </Text>
                    <Block
                      flex={false}
                      style={{width: widthPercentageToDP(15)}}
                    />
                    <Block
                      primary
                      margin={[0, w4, 0, 0]}
                      color={'#F7F8FA'}
                      borderRadius={30}
                      row
                      flex={false}>
                      <CustomButton
                        onPress={() => setFieldValue('typeVehicle', 'yes')}
                        center
                        middle
                        borderRadius={30}
                        padding={
                          values.typeVehicle === 'yes'
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={
                          values.typeVehicle === 'yes' ? '#FFFFFF' : '#F7F8FA'
                        }
                        shadow={values.typeVehicle === 'yes'}
                        margin={[0, w1]}>
                        <Text size={14} semibold>
                          Yes
                        </Text>
                      </CustomButton>
                      <CustomButton
                        onPress={() => setFieldValue('typeVehicle', 'no')}
                        center
                        middle
                        borderRadius={20}
                        padding={
                          values.typeVehicle === 'no'
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={
                          values.typeVehicle === 'no' ? '#FFFFFF' : '#F7F8FA'
                        }
                        shadow={values.typeVehicle === 'no'}>
                        <Text size={14} semibold>
                          No
                        </Text>
                      </CustomButton>
                    </Block>
                  </Block>
                </Block>
                <Block flex={false} padding={[0, w2]}>
                  <Block
                    // space={'between'}
                    center
                    margin={[t1, w1]}
                    row
                    flex={false}>
                    <Text
                      size={16}
                      style={{width: widthPercentageToDP(40)}}
                      regular>
                      Are you a sub-contractor?
                    </Text>
                    <Block
                      flex={false}
                      style={{width: widthPercentageToDP(15)}}
                    />
                    <Block
                      primary
                      margin={[0, w4, 0, 0]}
                      color={'#F7F8FA'}
                      borderRadius={30}
                      row
                      flex={false}>
                      <CustomButton
                        onPress={() => setFieldValue('typeContractor', 'yes')}
                        center
                        middle
                        borderRadius={30}
                        padding={
                          values.typeContractor === 'yes'
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={
                          values.typeContractor === 'yes'
                            ? '#FFFFFF'
                            : '#F7F8FA'
                        }
                        shadow={values.typeContractor === 'yes'}
                        margin={[0, w1]}>
                        <Text size={14} semibold>
                          Yes
                        </Text>
                      </CustomButton>
                      <CustomButton
                        onPress={() => setFieldValue('typeContractor', 'no')}
                        center
                        middle
                        borderRadius={20}
                        padding={
                          values.typeContractor === 'no'
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={
                          values.typeContractor === 'no' ? '#FFFFFF' : '#F7F8FA'
                        }
                        shadow={values.typeContractor === 'no'}>
                        <Text size={14} semibold>
                          No
                        </Text>
                      </CustomButton>
                    </Block>
                  </Block>
                </Block>
                <Block flex={false} padding={[0, w3]}>
                  {/* {values.type === 'company' && ( */}
                  <Input
                    label="Company name"
                    placeholder="Enter company name"
                    value={values.company}
                    onChangeText={handleChange('company')}
                    onBlur={() => setFieldTouched('company')}
                    error={touched.company && errors.company}
                  />
                  {/* )} */}
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
                    //  disabled={!isValid || !dirty}
                    isLoading={loading}
                    onPress={handleSubmit}
                    style={{marginTop: t2}}
                    color="secondary">
                    Finish registration
                  </Button>
                </Block>
              </KeyboardAwareScrollView>
              <Modalize
                adjustToContentHeight={true}
                handlePosition="inside"
                ref={modalizeRef}>
                {action === 'agent' && (
                  <AgentType
                    state={values.agent_type}
                    setValues={(v) => setFieldValue('agent_type', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'identry_card' && (
                  <ImagePicker
                    renderGallaryImage={renderIdCardImageDoc}
                    uploadImage={uploadDocumentIdCard}
                    state={values.identy_card}
                    setValues={(v) => setFieldValue('identry_card', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'Acv' && (
                  <ImagePicker
                    renderGallaryImage={renderAcvCardImage}
                    uploadImage={uploadDocumentAcv}
                    state={values.Acv}
                    setValues={(v) => setFieldValue('Acv', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'Ssn' && (
                  <ImagePicker
                    renderGallaryImage={renderSocialSecImage}
                    uploadImage={uploadDocumentSocial}
                    state={values.Acv}
                    setValues={(v) => setFieldValue('Ssn', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
              </Modalize>
            </>
          );
        }}
      </Formik>
      <Modal
        style={styles.modalStyle}
        isVisible={modal}
        onBackdropPress={() => setmodal(false)}>
        <View style={styles.modalView}>
          <Text semibold style={styles.modalText}>
            Registration Success !
          </Text>
          <Text style={styles.textStyle} center>
            Welcome to BeOnTime.
          </Text>
          <Button
            style={styles.button}
            onPress={() => onLogin()}
            color="secondary">
            Ok
          </Button>
        </View>
      </Modal>
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