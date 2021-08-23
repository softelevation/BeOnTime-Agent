import AsyncStorage from '@react-native-community/async-storage';
import {useFocusEffect} from '@react-navigation/core';
import React, {useState} from 'react';
import {Alert, FlatList, RefreshControl, ScrollView} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import {Block, Text} from '../../components';
import ActivityLoader from '../../components/activityLoader';
import Header from '../../components/common/header';
import EmptyFile from '../../components/emptyFile';
import ItemBox from '../../components/swipeable';
import {t1} from '../../components/theme/fontsize';
import {
  deleteNotificationRequest,
  getNotificationRequest,
} from '../../redux/notifications/action';
import {strictValidArrayWithLength} from '../../utils/commonUtils';
import {config} from '../../utils/config';

const Notifications = ({
  callNotificationApi,
  notifications,
  isLoad,
  callDeleteNotificationApi,
}) => {
  const socket = io(config.Api_Url);
  const languageMode = useSelector((state) => state.languageReducer.language);
  const [refreshing, setRefreshing] = useState(false);

  const {
    MostRecent,
    NotificationsLanguage,
    NoNotification,
    AreYouSure,
    RemoveNotification,
    Cancel,
    YesDoIt,
  } = languageMode;
  const clearNotification = async () => {
    const token = await AsyncStorage.getItem('token');

    const data = {
      token: token,
      type: 'notification',
    };
    socket.emit('clear_badge', data);
  };

  useFocusEffect(
    React.useCallback(() => {
      clearNotification();
      // callNotificationApi();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onhandleDelete = async (mission_id) => {
    callDeleteNotificationApi(mission_id);
  };
  const deleteItem = (id) => {
    Alert.alert(
      AreYouSure,
      RemoveNotification,
      [
        {
          text: Cancel,
        },
        {
          text: YesDoIt,
          onPress: () => onhandleDelete(id),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  const _renderItem = ({item, index}) => {
    return (
      <ItemBox
        handlePress={() => console.log('click')}
        data={item}
        handleDelete={(value) => deleteItem(value)}
      />
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    callNotificationApi();
  };
  return (
    <Block primary>
      <Header centerText={NotificationsLanguage} leftIcon />
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor="#000"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{flexGrow: 1}}>
        {isLoad && <ActivityLoader />}
        {strictValidArrayWithLength(notifications.recent) && (
          <Block margin={[t1]} flex={false}>
            <Text uppercase size={14} grey bold>
              {MostRecent}
            </Text>
            <Block
              borderColorDeafult
              margin={[t1, 0, 0]}
              borderWidth={[0, 0, 1, 0]}
              flex={false}
            />
            <FlatList
              scrollEnabled={false}
              data={notifications.recent}
              renderItem={_renderItem}
            />
          </Block>
        )}
        {strictValidArrayWithLength(notifications.all) ? (
          <Block padding={[0, t1, t1]} flex={false}>
            <Text uppercase margin={[t1, 0, 0]} size={14} grey bold>
              {NotificationsLanguage}
            </Text>
            <Block
              borderColorDeafult
              margin={[t1, 0, 0]}
              borderWidth={[0, 0, 1, 0]}
              flex={false}
            />
            <FlatList
              scrollEnabled={false}
              data={notifications.all}
              renderItem={_renderItem}
            />
          </Block>
        ) : (
          <>
            {!isLoad && !strictValidArrayWithLength(notifications.all) && (
              <EmptyFile text={NoNotification} />
            )}
          </>
        )}
      </ScrollView>
    </Block>
  );
};
const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications.data,
    isLoad: state.notifications.notifications.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    callNotificationApi: (...params) =>
      dispatch(getNotificationRequest(...params)),
    callDeleteNotificationApi: (...params) =>
      dispatch(deleteNotificationRequest(...params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
