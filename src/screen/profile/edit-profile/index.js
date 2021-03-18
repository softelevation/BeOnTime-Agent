import {Formik} from 'formik';
import React, {useState} from 'react';
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
import {w3} from '../../../components/theme/fontsize';
import * as yup from 'yup';
import {connect, useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonApi from '../../../utils/CommonApi';
import {updateProfileRequest} from '../../../redux/auth/profile/action';
const EditProfile = ({user}) => {
  const dispatch = useDispatch();
  const [userProfileDetails, setUserDetails] = useState({
    profileImage: '',
    uploading: false,
    profileData: '',
  });
  const {profileImage, profileData, uploading} = userProfileDetails;

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
            filename: image.filename ? image.filename : `photo.${filename}`,
            mimetype: image.mime,
            originalname: image.filename ? image.filename : `photo.${filename}`,
            encoding: '7bit',
            size: image.size,
            path:
              Platform.OS === 'ios'
                ? image.sourceURL
                : image.path.replace('file://', ''),
          },
        });
      }, 2000);
    });
  };
  console.log(profileData, 'profileData');

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

  const onSubmit = (values) => {
    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      home_address: values.home_address,
      image: JSON.stringify(profileData),
    };
    console.log(data, 'data');
    dispatch(updateProfileRequest(data));
  };

  return (
    <Block primary>
      <Header centerText="Edit Profile" />
      <KeyboardAwareScrollView>
        {renderProfileImage()}
        <Formik
          enableReinitialize
          initialValues={{
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            home_address: user.home_address,
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
                label="First Name"
                placeholder="Enter First Name"
                value={values.first_name}
                onChangeText={handleChange('first_name')}
                onBlur={() => setFieldTouched('first_name')}
                error={touched.first_name && errors.first_name}
              />
              <Input
                label="Last Name"
                placeholder="Enter Last Name"
                value={values.last_name}
                onChangeText={handleChange('last_name')}
                onBlur={() => setFieldTouched('last_name')}
                error={touched.last_name && errors.last_name}
              />
              <Input
                label="Phone Number"
                placeholder="Enter Phone Number"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={() => setFieldTouched('phone')}
                error={touched.phone && errors.phone}
              />
              <Input
                label="Home Address"
                placeholder="Enter Home Address"
                value={values.home_address}
                onChangeText={handleChange('home_address')}
                onBlur={() => setFieldTouched('home_address')}
                error={touched.home_address && errors.home_address}
              />
              <Button
                disabled={!isValid || !dirty}
                onPress={handleSubmit}
                color="secondary">
                Save Changes
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
  };
};
export default connect(mapStateToProps, null)(EditProfile);
