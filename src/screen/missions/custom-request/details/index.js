import React, {useState, useRef, useEffect} from 'react';
import {Block, Button, ImageComponent, Text} from '../../../../components';
import Header from '../../../../components/common/header';
import CommonMap from '../../../common/Map';
import {Modalize} from 'react-native-modalize';
import {t1, t2, w3} from '../../../../components/theme/fontsize';
import {AgentType, MissionType} from '../../../../utils/data';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {divider} from '../../../../utils/commonView';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {
  format,
  strictValidNumber,
  strictValidString,
} from '../../../../utils/commonUtils';
import AsyncStorage from '@react-native-community/async-storage';
import {
  customMissionRequest,
  getMissionsRequest,
} from '../../../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {StackActions, useNavigation} from '@react-navigation/core';
import moment from 'moment';
import {io} from 'socket.io-client';
import {config} from '../../../../utils/config';
import CustomAvatar from '../../../common/profile';
const initialState = {
  acceptloader: null,
  rejecttloader: null,
  startloader: null,
  finishloader: null,
};
const CustomMissionDetailScreen = ({
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

  const socket = io(config.Api_Url);

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
    created_at,
    start_date_time,
    end_date_time,
    custom_status,
    mission_id,
  } = item;
  const languageMode = useSelector((state) => state.languageReducer.language);
  const {
    MissionDate,
    StartMission,
    MissionDetails,
    Accept,
    Reject,
    FinishMission,
    MissionTypeHeader,
    AgentTypeHeader,
    LocationHeader,
    Yes,
    No,
    RepetitiveMission,
    Duration,
    VehicleRequired,
    MissionFinishedTime,
    TimeInterval,
    Hours,
  } = languageMode;
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

    socket.emit('custom_finish_mission', {
      mission_id: mission_id,
      token: token,
      custom_id: id,
    });
    // navigation.navigate('InProgress');
    socket.on(`custom_mission_data_${mission_id}`, (msg) => {
      dispatch(customMissionRequest());
      navigateToBack();
    });
  };

  const startMission = async () => {
    setloader({startloader: true});
    const token = await AsyncStorage.getItem('token');

    socket.emit('custom_start_mission', {
      mission_id: mission_id,
      token: token,
      custom_id: id,
    });
    // navigation.navigate('InProgress');
    setloader({startloader: false});
    socket.on(`custom_mission_data_${mission_id}`, (msg) => {
      dispatch(customMissionRequest());
      navigateToBack();
    });
  };

  const renderAgentDetails = () => {
    return (
      <Block flex={false}>
        <Block space={'between'} margin={[0, 0, t1]} flex={false} row>
          <Block flex={false} row>
            <CustomAvatar image={item.image} />
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

          {custom_status === 4 ? (
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
          ) : (
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
        </Block>
      </Block>
    );
  };
  const renderMissionStatus = () => {
    return (
      <Block margin={[t1, 0]} flex={false}>
        {(custom_status === 0 ||
          custom_status === 1 ||
          custom_status === 2) && (
          <Button
            isLoading={startloader}
            onPress={() => startMission(id)}
            color="secondary">
            {StartMission}
          </Button>
        )}
        {custom_status === 3 && (
          <Button
            isLoading={finishloader}
            onPress={() => finishMission(id)}
            color="secondary">
            {FinishMission}
          </Button>
        )}
        {custom_status === 4 && (
          <Button activeOpacity={1} color="secondary">
            {'Completed'}
          </Button>
        )}
      </Block>
    );
  };
  const MissionDetail = () => {
    return (
      <Block flex={false}>
        <Text semibold size={18}>
          {MissionDetails}
        </Text>
        <Text margin={[t1, 0, 0]} color="#8A8E99" size={14}>
          {description}
        </Text>
      </Block>
    );
  };
  const formatDate = (d) => {
    return moment(d).format('DD MMMM YYYY');
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
  const formatDuration = (d) => {
    var newsplit = d.split(':');
    const hours = newsplit[0].replace(/^0+/, '');
    return `${hours} ${Hours} : ${newsplit[1]} minutes`;
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
        {strictValidString(created_at) &&
          renderDetails(MissionDate, formatDate(created_at))}
        {strictValidString(intervention) &&
          renderDetails(MissionTypeHeader, MissionType(intervention))}
        {strictValidString(agent_type) &&
          renderDetails(AgentTypeHeader, AgentType(agent_type))}
        {strictValidString(location) && renderDetails(LocationHeader, location)}
        {strictValidString(total_hours) &&
          renderDetails(Duration, formatDuration(total_hours))}
        {strictValidNumber(vehicle_required) &&
          renderDetails(VehicleRequired, vehicle_required === 1 ? Yes : No)}
        {strictValidString(mission_finish_time) &&
          renderDetails(MissionFinishedTime, mission_finish_time)}
        {strictValidString(time_intervel) ||
          (strictValidNumber(time_intervel) &&
            renderDetails(TimeInterval, time_intervel))}
        {strictValidString(repetitive_mission) &&
          renderDetails(RepetitiveMission, repetitive_mission)}
        {strictValidString(start_date_time) &&
          renderDetails('Start Date and Time', start_date_time)}
        {strictValidString(end_date_time) &&
          renderDetails('End Date and Time', end_date_time)}
      </Block>

      {divider()}
    </Block>
  );
  return (
    <Block primary>
      <Header centerText={MissionDetails} />
      <Block flex={1}>
        <CommonMap agent={item} />
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

export default CustomMissionDetailScreen;
