/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import {Block, Button, CustomButton, Text} from '../../../components';
import ActivityLoader from '../../../components/activityLoader';
import EmptyFile from '../../../components/emptyFile';
import {t1, t2, w3, w5} from '../../../components/theme/fontsize';
import {customMissionRequest} from '../../../redux/action';
import {divider} from '../../../utils/commonView';
import {config} from '../../../utils/config';
import CustomAvatar from '../../common/profile';

const CustomRequest = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const MissionData = useSelector((state) => state.mission.customMissions.data);
  const isLoad = useSelector((state) => state.mission.customMissions.loading);
  const socket = io(config.Api_Url);
  const languageMode = useSelector((state) => state.languageReducer.language);

  const {
    TravelMission,
    StartMission,
    MissionDetails,
    FinishMission,
  } = languageMode;
  const dispatch = useDispatch();

  const startMission = async (id, custom_id) => {
    const token = await AsyncStorage.getItem('token');
    const mission_id = id;
    socket.emit('custom_start_mission', {
      mission_id: mission_id,
      token: token,
      custom_id: custom_id,
    });
    // navigation.navigate('InProgress');
    socket.on(`custom_mission_data_${mission_id}`, (msg) => {
      dispatch(customMissionRequest());
    });
  };
  const finishMission = async (id, custom_id) => {
    const token = await AsyncStorage.getItem('token');
    const mission_id = id;
    socket.emit('custom_finish_mission', {
      mission_id: mission_id,
      token: token,
      custom_id: custom_id,
    });
    // navigation.navigate('InProgress');
    socket.on(`custom_mission_data_${mission_id}`, (msg) => {
      dispatch(customMissionRequest());
    });
  };

  const travelToMission = async (item) => {
    const token = await AsyncStorage.getItem('token');
    const mission_id = item.mission_id;
    socket.emit('custom_travel_to_mission', {
      mission_id: mission_id,
      token: token,
      custom_id: item.id,
    });
    dispatch(customMissionRequest());
    navigation.navigate('TravelMissionCustom', {
      item: item,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    dispatch(customMissionRequest());
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
            MISN0{item.mission_id}
          </Text>
          <Text margin={[hp(0.5), 0]} size={16} semibold>
            {item.title}
          </Text>
        </Block>
        {divider()}
        {renderAgentDetails(item)}
        <Block flex={false} padding={[0, w3]}>
          {item.custom_status !== 4 && (
            <Button
              onPress={() =>
                item.custom_status !== 0
                  ? navigation.navigate('TravelMissionCustom', {
                      item: item,
                    })
                  : travelToMission(item)
              }
              color="primary">
              {TravelMission}
            </Button>
          )}
          {item.custom_status === 3 && (
            <Button
              onPress={() => finishMission(item.mission_id, item.id)}
              color="secondary">
              {FinishMission}
            </Button>
          )}
          {(item.custom_status === 0 ||
            item.custom_status === 1 ||
            item.custom_status === 2) && (
            <Button
              disabled={item.custom_status !== 2}
              onPress={() => startMission(item.mission_id, item.id)}
              color="secondary">
              {StartMission}
            </Button>
          )}
          {item.custom_status === 4 && (
            <Button activeOpacity={1} color="secondary">
              {'Completed'}
            </Button>
          )}
        </Block>
        <CustomButton
          onPress={() =>
            navigation.navigate('CustomMissionDetailScreen', {
              item: item,
            })
          }
          center>
          <Text size={14}>{MissionDetails}</Text>
        </CustomButton>
      </Block>
    );
  };
  const renderAgentDetails = (item) => {
    return (
      <Block margin={[0, w3, t1]} flex={false} row center space="between">
        <Block style={{width: wp(70)}} flex={false} row center>
          <CustomAvatar image={item.image} />
          <Block margin={[0, w3]} flex={false}>
            <Text
              transform="capitalize"
              semibold
              size={18}
              margin={[0, w3, 0, 0]}>
              {item.first_name} {item.last_name}
            </Text>
            <Text
              numberOfLines={1}
              style={{width: wp(55)}}
              margin={[hp(0.5), 0, 0]}
              size={16}
              grey>
              {item.location}
            </Text>
          </Block>
        </Block>
        <Block
          color={'#F7F8FA'}
          flex={false}
          center
          middle
          style={circle}
          borderRadius={30}>
          <Text bold margin={[-t1, 0, 0, 0]}>
            ...
          </Text>
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
          data={MissionData}
          renderItem={renderCards}
        />
      </Block>
    </Block>
  );
};
const circle = {height: 50, width: 50};

export default CustomRequest;
