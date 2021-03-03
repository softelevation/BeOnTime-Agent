import React from 'react';
import {View, StyleSheet,TouchableOpacity} from 'react-native';
import {} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import PropTypes from 'prop-types';

import Text from './Text';
import {images} from '../assets';

const styles = StyleSheet.create({
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: wp(2),
    paddingBottom: hp(2),
    borderTopWidth: 2,
    borderTopColor: '#E9EBF3',
    shadowColor: '#E9EBF3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

const tabImages = {
  Request: 'map',
  Message: 'message',
  Missions: 'mission',
  Notifications: 'notification',
  Profile: 'profile',
};

const renderHeight = (type) => {
  switch (type) {
    case 'map':
      return 23;
    case 'message':
      return 25;

    case 'mission':
      return 25;
    case 'notification':
      return 25;
    case 'profile':
      return 25;
    default:
      return 22;
  }
};
const renderWidth = (type) => {
  switch (type) {
    case 'map':
      return 26;
    case 'message':
      return 25;

    case 'mission':
      return 25;
    case 'notification':
      return 25;
    case 'profile':
      return 22;
    default:
      return 22;
  }
};

const BottomTab = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.ButtonContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            testID={options.tabBarTestID}
            onLongPress={onLongPress}
            accessibilityStates={isFocused ? ['selected'] : []}
            style={[{alignItems: 'center', width: wp(18)}]}
            onPress={onPress}>
            <View
              style={[
                isFocused && {borderTopWidth: 3},
                {width: wp(6), alignItems: 'center'},
              ]}
            />
            <ResponsiveImage
              source={
                isFocused
                  ? images[`${tabImages[label]}S`]
                  : images[`${tabImages[label]}U`]
              }
              // initHeight={renderHeight(isFocused, tabImages[label])}
              initHeight={renderHeight(tabImages[label])}
              initWidth={renderWidth(tabImages[label])}
              style={{marginTop: hp(1.5)}}
            />
            {isFocused ? (
              <Text
                semibold
                size={12}
                regular
                style={{
                  marginTop: hp(1),
                  color: '#000',
                }}>
                {label}
              </Text>
            ) : (
              <Text
                size={13}
                center
                regular
                style={{
                  marginTop: hp(1),
                  color: '#000',
                  width: wp(7),
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

BottomTab.propTypes = {
  state: PropTypes.shape(PropTypes.object),
};
BottomTab.defaultProps = {
  state: 'Search here',
};

export default BottomTab;
