import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Block, ImageComponent, Text} from '../../components';
import Header from '../../components/common/header';
import {t1, t2, w3} from '../../components/theme/fontsize';
import ItemBox from '../../components/swipeable';
import {useNavigation} from '@react-navigation/core';
import ChatMeesage from '../../components/swipeable';
import {connect} from 'react-redux';
import {getChatRequest} from '../../redux/messages/action';
import {
  strictValidArrayWithLength,
  strictValidArrayWithMinLength,
} from '../../utils/commonUtils';
import ActivityLoader from '../../components/activityLoader';

const MessageCenter = ({callGetChatApi, chat, isLoad}) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    callGetChatApi();
    const unsubscribe = navigation.addListener('focus', () => {
      callGetChatApi();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteItem = (index) => {
    // const arr = [...lists];
    // arr.splice(index, 1);
    // setLists(arr);
  };
  const _renderItem = ({item, index}) => {
    return (
      <ChatMeesage
        handlePress={() => {
          item.mission_id !== 0
            ? navigation.navigate('Chat', {
                id: item.mission_id,
                name: item.title,
              })
            : navigation.navigate('ChatOperator', {
                name: 'Need Support with Operator',
              });
        }}
        data={item}
        handleDelete={() => deleteItem(index)}
      />
    );
  };
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    callGetChatApi();
    wait(2000).then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Block primary>
      <Header leftIcon centerText="Message Center" />
      {isLoad && <ActivityLoader />}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {console.log(chat)}
        {strictValidArrayWithLength(chat.active) && (
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
              scrollEnabled={false}
              data={chat.active}
              renderItem={_renderItem}
            />
          </Block>
        )}
        {strictValidArrayWithMinLength(chat.finish) && (
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
              scrollEnabled={false}
              data={chat.finish}
              renderItem={_renderItem}
            />
          </Block>
        )}
      </ScrollView>
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

const mapStateToProps = (state) => {
  return {
    chat: state.messages.chat.data,
    isLoad: state.notifications.notifications.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    callGetChatApi: (...params) => dispatch(getChatRequest(...params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageCenter);
