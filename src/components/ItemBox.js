import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {formatTime} from '../utils/site-specific-common-utils';
import {CustomButton, Text} from './';
import Block from './Block';
import ImageComponent from './ImageComponent';
import {w1} from './theme/fontsize';

const SCREEN_WIDTH = Dimensions.get('window').width;

const NotificationItemBox = ({data, handleDelete, handlePress, type}) => {
  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        onPress={() => handleDelete(data.id)}
        activeOpacity={0.6}
        borderColorDeafult
        borderWidth={[0, 0, 1, 0]}
        margin={[0, 0, 0]}
        padding={[hp(1.5), 0]}
        flex={false}>
        <View style={styles.deleteBox}>
          <Animated.View style={{transform: [{scale: scale}]}}>
            <ImageComponent
              color="#fff"
              name="close_arrow_icon"
              height={20}
              width={20}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Swipeable renderRightActions={leftSwipe}>
      <CustomButton
        onPress={() => handlePress()}
        row
        center
        space="between"
        borderColorDeafult
        borderWidth={[0, 0, 1, 0]}
        margin={[0, 0, 0]}
        padding={[hp(1.5), w1]}
        flex={false}>
        <Block style={{width: widthPercentageToDP(82)}} flex={false}>
          <Text size={16} semibold>
            {data.mission_id !== 0
              ? data.mission_title || data.title
              : 'Need support with operator'}
          </Text>
          <Text margin={[hp(0.5), 0, 0]} grey size={14}>
            {type === 'en' ? `${data.message}` : `${data.message_fr}`}
          </Text>
        </Block>
        <Text grey size={14}>
          {formatTime(data.created_at)}
        </Text>
      </CustomButton>
    </Swipeable>
  );
};

export default NotificationItemBox;

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: SCREEN_WIDTH,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 16,
  },
  deleteBox: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(3),
  },
});
