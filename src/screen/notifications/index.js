import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {Alert, FlatList, ScrollView} from 'react-native';
import {connect} from 'react-redux';
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

const Notifications = ({
  callNotificationApi,
  notifications,
  isLoad,
  callDeleteNotificationApi,
}) => {
  const navigation = useNavigation();
  useEffect(() => {
    callNotificationApi();
    const unsubscribe = navigation.addListener('focus', () => {
      callNotificationApi();
    });

    return unsubscribe;
  }, []);

  const onhandleDelete = async (mission_id) => {
    callDeleteNotificationApi(mission_id);
  };
  const deleteItem = (id) => {
    console.log(id, 'id');
    Alert.alert(
      'Are you sure?',
      'You want to remove this notification',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes, do it',
          onPress: () => onhandleDelete(id),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  const _renderItem = ({item, index}) => {
    return <ItemBox data={item} handleDelete={(value) => deleteItem(value)} />;
  };
  return (
    <Block primary>
      <Header centerText="Notifications" leftIcon />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {isLoad && <ActivityLoader />}
        {strictValidArrayWithLength(notifications.recent) && (
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
              data={notifications.recent}
              renderItem={_renderItem}
            />
          </Block>
        )}
        {strictValidArrayWithLength(notifications.all) ? (
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
              data={notifications.all}
              renderItem={_renderItem}
            />
          </Block>
        ) : (
          <EmptyFile text="No Notifications" />
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
