/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, Linking, Platform, RefreshControl} from 'react-native';
import axios from 'axios';
import {config} from '../../../utils/config';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../../components';
import EmptyFile from '../../../components/emptyFile';
import {t1, t2, w3, w5} from '../../../components/theme/fontsize';
import {getMissionsRequest} from '../../../redux/action';
import {divider} from '../../../utils/commonView';
import ActivityLoader from '../../../components/activityLoader';
import AsyncStorage from '@react-native-community/async-storage';
import {showMessage} from 'react-native-flash-message';
import {io} from 'socket.io-client';

const InProgress = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const MissionData = useSelector((state) => state.mission.missions.data);
  const isLoad = useSelector((state) => state.mission.missions.loading);
  const {missionInProgress} = MissionData;
  const socket = io(config.Api_Url);

  const finishMission = async (id) => {
    const token = await AsyncStorage.getItem('token');
    const mission_id = id;
    socket.emit('finish_mission', {mission_id, token});
    navigation.navigate('Finished');

    socket.on(`finish_mission_${mission_id}`, (msg) => {
      dispatch(getMissionsRequest());
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    dispatch(getMissionsRequest());
  };

  const renderCards = ({item, index}) => {
    return (
      <Block
        shadow
        primary
        margin={[hp(1), w5, t2]}
        padding={[t2, 0, t2, 0]}
        borderRadius={10}>
        <Block padding={[0, w3]}>
          <Text semibold grey size={14}>
            MISN0{item.id}
          </Text>
          <Text margin={[hp(0.5), 0]} size={16} semibold>
            {item.title}
          </Text>
        </Block>
        {divider()}
        {renderAgentDetails(item)}
        {renderRequestReview(item)}
        <Block flex={false} padding={[0, w3]}>
          <Button onPress={() => finishMission(item.id)} color="secondary">
            Finish mission
          </Button>
        </Block>
        <CustomButton
          onPress={() =>
            navigation.navigate('MissionDetails', {
              item: item,
            })
          }
          center>
          <Text size={14}>Mission Details</Text>
        </CustomButton>
      </Block>
    );
  };
  const renderAgentDetails = (item) => {
    return (
      <Block margin={[0, w3, t1]} flex={false} row center>
        <ImageComponent name="blurAvatar_icon" height="50" width="50" />
        <Block margin={[0, w3]} flex={false}>
          <Text
            transform="capitalize"
            semibold
            size={18}
            margin={[0, w3, 0, 0]}>
            {item.first_name} {item.last_name}
          </Text>
          <Text margin={[hp(0.5), 0, 0]} size={16} grey>
            {item.location}
          </Text>
        </Block>
      </Block>
    );
  };
  const renderRequestReview = (item) => {
    return (
      <Block margin={[t1, w3, t1]} flex={false} row center>
        <Block
          color={'#F7F8FA'}
          flex={false}
          center
          middle
          style={circle}
          borderRadius={30}>
          <Text size={12} bold>
            0%
          </Text>
        </Block>
        <Block margin={[0, w3]} flex={false}>
          <Block flex={false}>
            <>
              <Text semibold size={16} margin={[0, w3, 0, 0]}>
                Mission Started
              </Text>
            </>
          </Block>
        </Block>
      </Block>
    );
  };
  return (
    <Block primary>
      {isLoad && <ActivityLoader />}
      <Block>
        <FlatList
          refreshControl={
            <RefreshControl
              tintColor="#000"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={<EmptyFile />}
          data={missionInProgress}
          renderItem={renderCards}
        />
      </Block>
    </Block>
  );
};
const circle = {height: 50, width: 50};

export default InProgress;
