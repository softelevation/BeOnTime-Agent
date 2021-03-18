import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CustomButton, Text} from './';
import Block from './Block';
import ImageComponent from './ImageComponent';
import {w1} from './theme/fontsize';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ItemBox = ({data, handleDelete}) => {
  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        onPress={handleDelete}
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
        row
        center
        space="between"
        borderColorDeafult
        borderWidth={[0, 0, 1, 0]}
        margin={[0, 0, 0]}
        padding={[hp(1.5), w1]}
        flex={false}>
        <Block flex={false}>
          <Text size={16} semibold>
            {data}
          </Text>
          <Text margin={[hp(0.5), 0, 0]} grey size={14}>
            Report confirmed.
          </Text>
        </Block>
        <Text grey size={14}>
          12:00pm
        </Text>
      </CustomButton>
    </Swipeable>
  );
};

export default ItemBox;

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
