/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../components';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {t1, t2, w1, w3, w4, w5} from '../../components/theme/fontsize';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {missionListRequest, profileRequest} from '../../redux/action';
import Header from '../../components/common/header';
import EmptyFile from '../../components/emptyFile';
import {divider} from '../../utils/commonView';
import CommonApi from '../../utils/CommonApi';
import {
  Alerts,
  format,
  strictValidObjectWithKeys,
} from '../../utils/commonUtils';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import AsyncStorage from '@react-native-community/async-storage';
import {light} from '../../components/theme/colors';
import ActivityLoader from '../../components/activityLoader';
import moment from 'moment';
import {config} from '../../utils/config';
import {io} from 'socket.io-client';

const initialState = {
  acceptloader: null,
  rejecttloader: null,
};
const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile.user.data);
  const agentList = useSelector((state) => state.request.list.agents);
  const load = useSelector((state) => state.request.list.loading);
  const [type, settype] = useState(null);
  const [loader, setloader] = useState(initialState);
  const {acceptloader, rejecttloader} = loader;
  const [refreshing, setRefreshing] = useState(false);
  const socket = io(config.Api_Url);
  const languageMode = useSelector((state) => state.languageReducer.language);

  const {
    Yes,
    No,
    Accept,
    Reject,
    MissionDetails,
    AcceptingNewMissionRequest,
    MissionRequest,
  } = languageMode;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    ApiRequest();
  };

  useEffect(() => {
    ApiRequest();
    if (strictValidObjectWithKeys(profile)) {
      socket.on(`refresh_feed_${profile.id}`, (msg) => {
        ApiRequest();
      });
    }
    dispatch(profileRequest());
  }, []);

  useEffect(() => {
    if (strictValidObjectWithKeys(profile)) {
      settype(profile.available);
    }
  }, [profile]);

  const ApiRequest = () => {
    dispatch(missionListRequest());
  };

  const changeStatus = async (status) => {
    settype(status);
    const color = status === '0' ? light.danger : light.success;
    const token = await AsyncStorage.getItem('token');
    const data = {
      token: token,
      status: status,
    };
    CommonApi.fetchAppCommon(
      '/agent/agent-available',
      'POST',
      JSON.stringify(data),
    )
      .then((response) => {
        if (response.status === 1) {
          Alerts(response.message, '', color);
        }
      })
      .catch((err) => {});
  };

  const acceptRejectMission = (id, status) => {
    const val = status === '1' ? {acceptloader: id} : {rejecttloader: id};
    setloader(val);
    const mission_id = id;
    socket.emit('agent_mission_request', {mission_id, status});
    setTimeout(() => {
      ApiRequest();
    }, 2000);
  };
  const calculateTime = (assigned, current) => {
    var startTime = moment(assigned, 'HH:mm:ss a');
    var endTime = moment(current, 'HH:mm:ss a');

    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime));

    // duration in hours
    var hours = parseInt(duration.asHours()) * 60;

    // duration in minutes
    var minutes = parseInt(duration.asMinutes()) % 60;

    return hours + minutes * 60;
  };
  const renderAgentDetails = (item) => {
    // const time = moment(item.assigned_at).format('HH:mm:ss a');
    // const newDate = moment(new Date()).format('HH:mm:ss a');
    // const interval = calculateTime(time, newDate);
    // alert(interval);
    // console.log(time, newDate);
    return (
      <Block margin={[0, w3, t1]} flex={false} row space="between">
        <Block flex={false} row center>
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
        <CountdownCircleTimer
          isPlaying
          size={50}
          strokeWidth={4}
          duration={0}
          colors={'#000'}>
          {({remainingTime, animatedColor}) => (
            <Text size={12} bold>
              {format(remainingTime)}
            </Text>
          )}
        </CountdownCircleTimer>
      </Block>
    );
  };

  const renderCards = ({item, index}) => {
    return (
      <Block
        shadow
        primary
        margin={[hp(1), w5, t2]}
        padding={[hp(2), 0, t2, 0]}
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
        <Block row space={'around'} flex={false} center>
          <Button
            loaderColor="#000"
            isLoading={rejecttloader === item.id}
            style={{width: wp(40)}}
            onPress={() => acceptRejectMission(item.id, '2')}
            color="primary">
            {Reject}
          </Button>
          <Button
            isLoading={acceptloader === item.id}
            style={{width: wp(40)}}
            onPress={() => acceptRejectMission(item.id, '1')}
            color="secondary">
            {Accept}
          </Button>
        </Block>
        <CustomButton
          onPress={() =>
            navigation.navigate('MissionDetails', {
              item: item,
            })
          }
          margin={[t1, 0]}
          center>
          <Text semibold size={14}>
            {MissionDetails}
          </Text>
        </CustomButton>
      </Block>
    );
  };
  return (
    <Block primary>
      <Header centerText={MissionRequest} leftIcon />
      {load && <ActivityLoader />}
      <>
        <Block>
          <Block flex={false} padding={[0, w4]}>
            <Block center margin={[t1, w3]} row flex={false}>
              <Text size={16} style={{width: widthPercentageToDP(45)}} regular>
                {AcceptingNewMissionRequest}
              </Text>
              <Block
                primary
                margin={[0, w4, 0, 0]}
                color={'#F7F8FA'}
                borderRadius={30}
                row
                flex={false}>
                <CustomButton
                  onPress={() => changeStatus('1')}
                  center
                  middle
                  borderRadius={30}
                  padding={
                    type === '1'
                      ? [heightPercentageToDP(1.5), widthPercentageToDP(8)]
                      : [0, widthPercentageToDP(6)]
                  }
                  color={type === '1' ? '#FFFFFF' : '#F7F8FA'}
                  shadow={type === '1'}
                  margin={[0, w1]}>
                  <Text size={14} semibold>
                    {Yes}
                  </Text>
                </CustomButton>
                <CustomButton
                  onPress={() => changeStatus('0')}
                  center
                  middle
                  borderRadius={20}
                  padding={
                    type === '0'
                      ? [heightPercentageToDP(1.5), widthPercentageToDP(8)]
                      : [0, widthPercentageToDP(6)]
                  }
                  color={type === '0' ? '#FFFFFF' : '#F7F8FA'}
                  shadow={type === '0'}>
                  <Text size={14} semibold>
                    {No}
                  </Text>
                </CustomButton>
              </Block>
            </Block>
          </Block>
          <Block flex={1} margin={[t1, 0, 0]}>
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
              data={agentList}
              renderItem={renderCards}
            />
          </Block>
        </Block>
      </>
    </Block>
  );
};

export default Home;
