import React, {useState, useRef, useEffect} from 'react';
import {Block, Button, ImageComponent, Text} from '../../../components';
import Header from '../../../components/common/header';
import CommonMap from '../../common/Map';
import {Modalize} from 'react-native-modalize';
import {t1, t2, w3} from '../../../components/theme/fontsize';
import {AgentType, MissionType, PaymentStatus} from '../../../utils/data';
import Rating from '../../../components/ratings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {divider} from '../../../utils/commonView';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import CommonApi from '../../../utils/CommonApi';
// import SignatureScreen from '../../../components/common/signature';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {format} from '../../../utils/commonUtils';

const MissionDetails = ({
  route: {
    params: {item},
  },
}) => {
  const [toggle, setToggle] = useState(true);
  const modalizeRef = useRef(null);
  useEffect(() => {
    modalizeRef.current?.open();
  }, []);
  const {
    id,
    first_name,
    last_name,
    title,
    location,
    latitude,
    longitude,
    agent_type,
    description,
    vehicle_required,
    total_hours,
    amount,
    payment_status,
    status,
    intervention,
    start_date_time,
  } = item;
  const ref = useRef();

  useEffect(() => {
    CommonApi.fetchAppCommon('/agent/mission/' + item.id, 'GET', '')
      .then((response) => {
        if (response.status == 1) {
        }
      })
      .catch((err) => {});
  }, []);

  const handleSignature = (signature) => {};

  const handleEmpty = () => {};

  const handleClear = () => {};

  const handleEnd = () => {
    ref.current.readSignature();
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 600,
      cropping: false,
    }).then((image) => {});
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  };

  const acceptRejectMission = () => {
    //  const val = status === '1' ? {acceptloader: id} : {rejecttloader: id};
    //  setloader(val);
    //  const mission_id = id;
    //  socket.emit('agent_mission_request', {mission_id, status});
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
              <Text margin={[hp(0.5), 0, 0]} size={16} grey>
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
              <Text bold size={12}>
                20%
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
                20%
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
        {/* <Block
          color={values === 'finished' ? '#000' : '#F7F8FA'}
          flex={false}
          center
          middle
          style={{height: 50, width: 50}}
          borderRadius={30}>
          {status === 3 && (
            <Text bold margin={[-t1, 0, 0, 0]}>
              ...
            </Text>
          )}
          {status === 4 && (
            <Text size={12} bold>
              0%
            </Text>
          )}
          {status === 5 && (
            <Text white size={12} bold>
              100%
            </Text>
          )}
        </Block>
        <Block margin={[0, w3]} flex={false}>
          <Block flex={false}>
            {status === 3 && (
              <>
                <Text semibold size={16} margin={[0, w3, 0, 0]}>
                  Request in Review
                </Text>
                <Text margin={[hp(0.5), 0, 0]} size={14} grey>
                  You will receive notification soon.
                </Text>
              </>
            )}
            {status === 4 && (
              <>
                <Text semibold size={16} margin={[0, w3, 0, 0]}>
                  Mission Accepted
                </Text>
                <Text margin={[hp(0.5), 0, 0]} size={14} grey>
                  Reaching location in 15 min.
                </Text>
              </>
            )}
            {status === 5 && (
              <>
                <Text semibold size={16} margin={[0, w3, 0, 0]}>
                  Mission Accepted
                </Text>
                <Text margin={[hp(0.5), 0, 0]} size={14} grey>
                  Mission ended. Payment pending.
                </Text>
              </>
            )}
          </Block>
        </Block> */}
        {status === 0 && (
          <Block row space={'between'} flex={false} center>
            <Button
              loaderColor="#000"
              // isLoading={rejecttloader === item.id}
              style={{width: wp(43)}}
              onPress={() => acceptRejectMission(item.id, '2')}
              color="primary">
              Reject
            </Button>
            <Button
              // isLoading={acceptloader === item.id}
              style={{width: wp(43)}}
              onPress={() => acceptRejectMission(item.id, '1')}
              color="secondary">
              Accept
            </Button>
          </Block>
        )}
        {status === 3 && (
          <Button
            onPress={() => acceptRejectMission(item.id, '1')}
            color="secondary">
            Start Mission
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
      </Block>
      {divider()}
      {/* <Text semibold size={18}>
        Payment Details
      </Text>
      <Block flex={false} margin={[t1, 0, 0]}>
        {renderDetails('Amount', `$${amount}`)}
        {renderDetails('Status', PaymentStatus(payment_status))}
        {renderDetails('Due', formatDate(start_date_time))}
      </Block> */}
      {/* <SignatureScreen
        ref={ref}
        onEnd={handleEnd}
        onOK={handleSignature}
        onEmpty={handleEmpty}
        onClear={handleClear}
        autoClear={true}
        descriptionText={'text'}
      /> */}
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
        // contentRef={contentRef}
        alwaysOpen={350}
        snapPoint={350}
        handlePosition="inside"

        // snapPoint={350}
        // handlePosition="inside"
      >
        {renderHeader()}
      </Modalize>
    </Block>
  );
};

export default MissionDetails;
