import React from 'react';
import {FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Block, CustomButton, Text} from '../../components';
import Header from '../../components/common/header';
import ItemBox from '../../components/swipeable';
import {t1, w1} from '../../components/theme/fontsize';

const Notifications = () => {
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
      <Header centerText="Notifications" leftIcon />
      <Block margin={[t1]} flex={false}>
        <Text size={14} grey semibold>
          MOST RECENT
        </Text>
        <Block
          borderColorDeafult
          margin={[t1, 0, 0]}
          borderWidth={[0, 0, 1, 0]}
          flex={false}
        />
        <FlatList
          scrollEnabled={false}
          data={['Patroling the chemical factory', 'Securing the area']}
          renderItem={_renderItem}
        />
      </Block>
      <Block padding={[0, t1, t1]} flex={false}>
        <Text margin={[t1, 0, 0]} size={14} grey semibold>
          NOTIFICATIONS
        </Text>
        <Block
          borderColorDeafult
          margin={[t1, 0, 0]}
          borderWidth={[0, 0, 1, 0]}
          flex={false}
        />
        <FlatList
          scrollEnabled={false}
          data={['Hostesses services', 'Securing the mall']}
          renderItem={_renderItem}
        />
      </Block>
    </Block>
  );
};

export default Notifications;
