import React, {useRef, useState} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../../components';
import {t1, t3, w5} from '../../../components/theme/fontsize';

const dataNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const NumberOfHours = ({state, setValues, closeModal}) => {
  const [time, settime] = useState(state);
  const flatlistRef = useRef();
  const _renderItem = ({item, index}) => {
    return (
      <CustomButton
        onPress={() => {
          settime(item);
          flatlistRef.current &&
            flatlistRef.current.scrollToIndex({
              animated: true,
              index,
              viewOffset: Dimensions.get('window').width / 2.5,
            });
        }}
        margin={[t1, 0]}
        center
        middle
        padding={[t1 * 1.5]}>
        <Text
          semibold={time === item && '#000'}
          color={time === item && '#000'}
          grey
          size={20}>
          {item}
        </Text>
      </CustomButton>
    );
  };
  return (
    <Block padding={[t3, w5]}>
      <Text margin={[t1]} semibold center size={22}>
        Number of hours
      </Text>
      <Block margin={[t1, 0, 0]} flex={false} center middle>
        <ImageComponent name="selected_icon" height="15" width="15" />
      </Block>
      <FlatList
        ref={flatlistRef}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        data={dataNum}
        renderItem={_renderItem}
        decelerationRate={0}
        snapToInterval={wp(90) - (wp(40) + wp(40))}
        snapToAlignment={'center'}
        contentInset={{
          top: 0,
          left: wp(45),
          bottom: 0,
          right: wp(45),
        }}
      />
      <Button
        disabled={!time}
        onPress={() => {
          setValues(time);
          closeModal();
        }}
        color="secondary">
        Done
      </Button>
    </Block>
  );
};

export default NumberOfHours;
