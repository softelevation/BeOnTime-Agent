import React, {useState, useRef, useEffect} from 'react';
import {Block, Button, ImageComponent, Text} from '../../../components';
import Header from '../../../components/common/header';
import CommonMap from '../../common/Map';
import {Modalize} from 'react-native-modalize';
import {t1, t2, w3} from '../../../components/theme/fontsize';
import {AgentType, MissionType} from '../../../utils/data';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {divider} from '../../../utils/commonView';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {
  format,
  strictValidNumber,
  strictValidString,
} from '../../../utils/commonUtils';
import AsyncStorage from '@react-native-community/async-storage';
import {getMissionsRequest, missionListRequest} from '../../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {StackActions, useNavigation} from '@react-navigation/core';
const initialState = {
  acceptloader: null,
  rejecttloader: null,
  startloader: null,
  finishloader: null,
};
const MissionDetails = ({
  route: {
    params: {item},
  },
}) => {
  const modalizeRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loader, setloader] = useState(initialState);

  const {acceptloader, rejecttloader, finishloader, startloader} = loader;

  // Reducers

  const socket = useSelector((state) => state.socket.data);

  const {
    id,
    first_name,
    last_name,
    title,
    location,
    agent_type,
    description,
    vehicle_required,
    total_hours,
    status,
    intervention,
    mission_finish_time,
    time_intervel,
    repetitive_mission,
  } = item;
  useEffect(() => {
    modalizeRef.current?.open();
  }, []);

  const navigateToBack = () => {
    navigation.dispatch(StackActions.pop());
  };

  const acceptRejectMission = (id, status) => {
    const val = status === '1' ? {acceptloader: id} : {rejecttloader: id};
    setloader(val);
    const mission_id = id;
    socket.emit('agent_mission_request', {mission_id, status});
    navigateToBack();
  };

  const finishMission = async (id) => {
    const token = await AsyncStorage.getItem('token');
    const mission_id = id;
    socket.emit('finish_mission', {mission_id, token});

    socket.on(`finish_mission_${mission_id}`, (msg) => {
      dispatch(getMissionsRequest());
      navigateToBack();
    });
  };

  const startMission = async (id) => {
    setloader({startloader: true});
    const token = await AsyncStorage.getItem('token');
    const mission_id = id;
    socket.emit('start_mission', {mission_id, token});
    setloader({startloader: false});
    socket.on(`mission_data_${mission_id}`, (msg) => {
      dispatch(getMissionsRequest());
      navigateToBack();
    });
  };

  const renderAgentDetails = () => {
    return (
      <Block flex={false}>
        <Block space={'between'} margin={[0, 0, t1]} flex={false} row>
          <Block flex={false} row>
            <ImageComponent name="blurAvatar_icon" height="60" width="60" />
            <Block margin={[0, w3]} flex={false}>
              <Block row center flex={false}>
                <Text
                  transform="capitalize"
                  semibold
                  size={18}
                  margin={[0, w3, 0, 0]}>
                  {first_name} {last_name}
                </Text>
                <ImageComponent name="vehicle_icon" height="25" width="25" />
              </Block>
              <Text
                style={{width: wp(60)}}
                numberOfLines={1}
                margin={[hp(0.5), 0, 0]}
                size={16}
                grey>
                {location}
              </Text>
            </Block>
          </Block>
          {status === 0 && (
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
          )}
          {status === 3 && (
            <Block
              color={'#F7F8FA'}
              flex={false}
              center
              middle
              style={{height: 50, width: 50}}
              borderRadius={30}>
              <Text bold margin={[-t1, 0, 0, 0]}>
                ...
              </Text>
            </Block>
          )}
          {status === 4 && (
            <Block
              color={'#F7F8FA'}
              flex={false}
              center
              middle
              style={{height: 50, width: 50}}
              borderRadius={30}>
              <Text size={12} bold>
                0%
              </Text>
            </Block>
          )}
          {status === 5 && (
            <Block
              color={'#000'}
              flex={false}
              center
              middle
              style={{height: 50, width: 50}}
              borderRadius={30}>
              <Text white bold size={12}>
                100%
              </Text>
            </Block>
          )}
        </Block>
      </Block>
    );
  };
  const renderMissionStatus = () => {
    return (
      <Block margin={[t1, 0]} flex={false}>
        {status === 0 && (
          <Block row space={'between'} flex={false} center>
            <Button
              loaderColor="#000"
              isLoading={rejecttloader === id}
              style={{width: wp(43)}}
              onPress={() => acceptRejectMission(id, '2')}
              color="primary">
              Reject
            </Button>
            <Button
              isLoading={acceptloader === id}
              style={{width: wp(43)}}
              onPress={() => acceptRejectMission(id, '1')}
              color="secondary">
              Accept
            </Button>
          </Block>
        )}
        {status === 3 && (
          <Button
            isLoading={startloader}
            onPress={() => startMission(id)}
            color="secondary">
            Start Mission
          </Button>
        )}
        {status === 4 && (
          <Button
            isLoading={finishloader}
            onPress={() => finishMission(id)}
            color="secondary">
            Finish Mission
          </Button>
        )}
      </Block>
    );
  };
  const MissionDetail = () => {
    return (
      <Block flex={false}>
        <Text semibold size={18}>
          Mission details
        </Text>
        <Text margin={[t1, 0, 0]} color="#8A8E99" size={14}>
          {description}
        </Text>
      </Block>
    );
  };
  const renderDetails = (header, content) => {
    return (
      <Block center margin={[hp(0.5), 0]} flex={false} row space={'between'}>
        <Text size={16} regular>
          {header}
        </Text>
        <Text regular grey size={16}>
          {content}
        </Text>
      </Block>
    );
  };
  const renderHeader = () => (
    <Block padding={[t2]} flex={false}>
      <Text size={13} grey semibold>
        MISN0{id}
      </Text>
      <Text margin={[t1, 0, t1]} semibold size={20}>
        {title}
      </Text>
      {divider()}
      {renderAgentDetails()}
      {renderMissionStatus()}
      {divider()}
      {MissionDetail()}
      <Block flex={false} margin={[t2, 0, 0]}>
        {renderDetails('Mission type', MissionType(intervention))}
        {renderDetails('Agent type', AgentType(agent_type))}
        {renderDetails('Location', location)}
        {renderDetails('Duration', `${total_hours} hours`)}
        {renderDetails(
          'Vehicle required',
          vehicle_required === 1 ? 'Yes' : 'No',
        )}
        {strictValidString(mission_finish_time) &&
          renderDetails('Mission finished time', mission_finish_time)}
        {strictValidString(time_intervel) ||
          (strictValidNumber(time_intervel) &&
            renderDetails('Time interval', time_intervel))}
        {strictValidString(repetitive_mission) &&
          renderDetails('Repetitive mission', repetitive_mission)}
      </Block>
      {divider()}
    </Block>
  );
  return (
    <Block primary>
      <Header centerText="Mission-Details" />
      <Block flex={1}>
        <CommonMap />
      </Block>

      <Modalize
        ref={modalizeRef}
        alwaysOpen={500}
        snapPoint={500}
        handlePosition="inside">
        {renderHeader()}
      </Modalize>
    </Block>
  );
};

export default MissionDetails;
