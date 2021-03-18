import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {Block, ImageComponent, Text} from '../../components';
import Header from '../../components/common/header';
import {t1, t2, w3} from '../../components/theme/fontsize';
import ItemBox from '../../components/swipeable';
import {useNavigation} from '@react-navigation/core';

const MessageCenter = () => {
  const navigation = useNavigation();
  const deleteItem = (index) => {
    // const arr = [...lists];
    // arr.splice(index, 1);
    // setLists(arr);
  };
  const _renderItem = ({item, index}) => {
    return <ItemBox data={item} handleDelete={() => deleteItem(index)} />;
  };
  return (
    <Block primary>
      <Header leftIcon centerText="Message Center" />
      <Block margin={[t1]} flex={false}>
        <Text size={14} grey semibold>
          Active
        </Text>
        <Block
          borderColorDeafult
          margin={[t1, 0, 0]}
          borderWidth={[0, 0, 1, 0]}
          flex={false}
        />
        <FlatList
          data={['Patroling the chemical factory', 'Securing the area']}
          renderItem={_renderItem}
        />
      </Block>
      <Block padding={[0, t1, t1]} flex={false}>
        <Text margin={[t1, 0, 0]} size={14} grey semibold>
          Finished
        </Text>
        <Block
          borderColorDeafult
          margin={[t1, 0, 0]}
          borderWidth={[0, 0, 1, 0]}
          flex={false}
        />
        <FlatList
          data={['Hostesses services', 'Securing the mall']}
          renderItem={_renderItem}
        />
      </Block>
      <TouchableOpacity
        style={plusIcon}
        onPress={() => navigation.navigate('NewSupport')}>
        <ImageComponent name="plus_icon" height="60" width="70" />
      </TouchableOpacity>
    </Block>
  );
};
const plusIcon = {
  position: 'absolute',
  bottom: t2,
  right: w3,
};

export default MessageCenter;
