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
import {missionListRequest} from '../../redux/action';
import Header from '../../components/common/header';
import EmptyFile from '../../components/emptyFile';
import CommonMap from '../common/Map';
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

const initialState = {
  acceptloader: null,
  rejecttloader: null,
};
const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.data);
  const profile = useSelector((state) => state.user.profile.user.data);
  const agentList = useSelector((state) => state.request.list.agents);
  const load = useSelector((state) => state.request.list.loading);
  const [type, settype] = useState(null);
  const [loader, setloader] = useState(initialState);
  const {acceptloader, rejecttloader} = loader;
  const [refreshing, setRefreshing] = useState(false);

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
    console.log(mission_id, status, 'mission_id, status');
    setTimeout(() => {
      ApiRequest();
    }, 2000);
  };
  const renderAgentDetails = (item) => {
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
          duration={item.time_intervel}
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
        margin={[0, w5, t2]}
        padding={[0, 0, t2, 0]}
        borderRadius={10}>
        <Block margin={[0, 0, t2]} style={{height: hp(15)}} secondary>
          <CommonMap />
        </Block>
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
        {/* {renderRequestReview(item)} */}
        <Block row space={'around'} flex={false} center>
          <Button
            loaderColor="#000"
            isLoading={rejecttloader === item.id}
            style={{width: wp(40)}}
            onPress={() => acceptRejectMission(item.id, '2')}
            color="primary">
            Reject
          </Button>
          <Button
            isLoading={acceptloader === item.id}
            style={{width: wp(40)}}
            onPress={() => acceptRejectMission(item.id, '1')}
            color="secondary">
            Accept
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
            Mission Details
          </Text>
        </CustomButton>
      </Block>
    );
  };
  return (
    <Block primary>
      <Header centerText="Mission Requests" leftIcon />
      {load && <ActivityLoader />}
      <>
        <Block>
          <Block flex={false} padding={[0, w4]}>
            <Block center margin={[t1, w3]} row flex={false}>
              <Text size={16} style={{width: widthPercentageToDP(45)}} regular>
                Accepting new mission requests?
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
                    Yes
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
                    No
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
