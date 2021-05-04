import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {googleKey} from '../utils/constants';
import {Block, Text} from './';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RobotoRegular} from './theme/fontsize';
import {strictValidString} from '../utils/commonUtils';
const GooglePlacesTextInput = ({
  placeholder,
  onPress,
  error,
  center,
  label,
  onBlur,
  textInputProps,
  ref,
}) => {
  return (
    <Block
      color={'#F5F7FA'}
      borderWidth={1}
      borderColor={error ? 'red' : 'transparent'}>
      {strictValidString(label) && (
        <Text
          errorColor={error}
          caption
          regular
          center={center ? true : false}
          black={!error}
          accent={error}
          color="#8A8E99"
          style={{marginLeft: wp(2.5), marginTop: hp(1)}}
          size={12}>
          {label}
        </Text>
      )}
      <GooglePlacesAutocomplete
        ref={ref}
        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        placeholder={placeholder}
        enablePoweredByContainer={false}
        minLength={1}
        isRowScrollable={false}
        returnKeyType={'default'}
        textInputProps={textInputProps}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          onPress(data, details);
        }}
        query={{
          key: googleKey,
          language: 'en',
          components: 'country:fr',
        }}
        styles={{
          textInputContainer: {
            marginTop: strictValidString(label) ? hp(0.4) : hp(0.8),
            marginBottom: hp(0.5),
            backgroundColor: '#F5F7FA',
            color: '#8A8E99',
            fontSize: 16,
          },
          textInput: {
            paddingVertical: hp(0.2),
            height: 20,
            color: '#8A8E99',
            fontWeight: 'bold',
            fontSize: 16,
            backgroundColor: 'transparent',
          },
          description: {
            color: '#8A8E99',
            fontFamily: RobotoRegular,
            fontSize: 16,
            zIndex: 99,
          },
          listView: {
            color: '#8A8E99',
            fontSize: 14,
            zIndex: 1000, //To popover the component outwards,
          },
        }}
      />
    </Block>
  );
};

export default GooglePlacesTextInput;
