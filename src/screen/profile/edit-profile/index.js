import {Formik} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {images} from '../../../assets';
import {Block, Button, ImageComponent, Input} from '../../../components';
import Header from '../../../components/common/header';
import {t1, w3} from '../../../components/theme/fontsize';
import * as yup from 'yup';
import {connect, useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {updateProfileRequest} from '../../../redux/auth/profile/action';
import GooglePlacesTextInput from '../../../components/googlePlaces';
import {UPLOAD} from '../../../utils/site-specific-common-utils';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/commonUtils';
import {config} from '../../../utils/config';
const EditProfile = ({user, isLoad}) => {
  const dispatch = useDispatch();
  const [userProfileDetails, setUserDetails] = useState({
    uploading: false,
    profileData: '',
  });
  const {profileData, uploading} = userProfileDetails;
  const [ProfileImage, setProfileImage] = useState(null);
  const [imageVal, setimage] = useState({});
  const languageMode = useSelector((state) => state.languageReducer.language);
  const {
    FirstName,
    LastName,
    PhoneNumber,
    HomeAddress,
    EditProfileLanguage,
    SaveChanges,
  } = languageMode;
  const uploadPhoto = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      freeStyleCropEnabled: true,
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
        profileImage: Platform.OS === 'ios' ? image.sourceURL : image.path,
        uploading: true,
      });
      setProfileImage(Platform.OS === 'ios' ? image.sourceURL : image.path);
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
        console.log(res.data);
        setUserDetails({
          ...userProfileDetails,
          uploading: false,
        });
        setimage(JSON.parse(res.data));
      }
    });
  };
  console.log(profileData, 'profileData');

  const renderProfileImagePath = () => {
    if (ProfileImage) {
      return {uri: ProfileImage};
    } else if (
      strictValidObjectWithKeys(user) &&
      strictValidString(user.image)
    ) {
      return {uri: `${config.Api_Url}/${user.image}`};
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

  const onSubmit = (values) => {
    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      home_address: values.home_address,
      image: strictValidObjectWithKeys(imageVal) ? imageVal.value : '',
    };
    console.log(data, 'data');
    dispatch(updateProfileRequest(data));
  };

  return (
    <Block primary>
      <Header centerText={EditProfileLanguage} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        {renderProfileImage()}
        <Formik
          enableReinitialize
          initialValues={{
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || '',
            home_address: user.home_address || '',
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            first_name: yup.string().min(1).required(),
            last_name: yup.string().min(1).required(),
            phone: yup.string().min(10).required(),
            home_address: yup.string().min(3).required(),
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
            <Block padding={[0, w3]}>
              <Input
                label={FirstName}
                placeholder="Enter First Name"
                value={values.first_name}
                onChangeText={handleChange('first_name')}
                onBlur={() => setFieldTouched('first_name')}
                error={touched.first_name && errors.first_name}
              />
              <Input
                label={LastName}
                placeholder="Enter Last Name"
                value={values.last_name}
                onChangeText={handleChange('last_name')}
                onBlur={() => setFieldTouched('last_name')}
                error={touched.last_name && errors.last_name}
              />
              <Input
                label={PhoneNumber}
                placeholder="Enter Phone Number"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={() => setFieldTouched('phone')}
                error={touched.phone && errors.phone}
              />
              <Input
                label={HomeAddress}
                placeholder="Enter Home Address"
                value={values.home_address}
                onChangeText={handleChange('home_address')}
                onBlur={() => setFieldTouched('home_address')}
                error={touched.home_address && errors.home_address}
              />
              <Button
                isLoading={isLoad}
                disabled={!isValid}
                onPress={handleSubmit}
                color="secondary">
                {SaveChanges}
              </Button>
            </Block>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </Block>
  );
};
const LoaderStyle = {
  height: 120,
  width: 120,
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: heightPercentageToDP(2),
};
const BackgroundStyle = {
  height: 120,
  width: 120,
  alignSelf: 'center',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  marginVertical: heightPercentageToDP(2),
};

const mapStateToProps = (state) => {
  return {
    user: state.user.profile.user.data,
    isLoad: state.user.profile.loading,
  };
};
export default connect(mapStateToProps, null)(EditProfile);
