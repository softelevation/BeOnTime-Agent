import React, {useState, useRef, useEffect} from 'react';
import {Block, Button, ImageComponent, Text} from '../../../components';
import Header from '../../../components/common/header';
import CommonMap from '../../common/Map';
import {Modalize} from 'react-native-modalize';
import {t1, t2, w3} from '../../../components/theme/fontsize';
import {AgentType, MissionType, PaymentStatus} from '../../../utils/data';
import Rating from '../../../components/ratings';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {divider} from '../../../utils/commonView';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
// import SignatureScreen from '../../../components/common/signature';

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
    username,
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

  const handleSignature = (signature) => {
    console.log(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    console.log('clear success!');
  };

  const handleEnd = () => {
    ref.current.readSignature();
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 600,
      cropping: false,
    }).then((image) => {
      console.log(image);
    });
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  };
  const renderAgentDetails = () => {
    return (
      <Block flex={false}>
        <Block space={'between'} margin={[0, 0, t1]} flex={false} row>
          <Block flex={false} row>
            <ImageComponent name="blurAvatar_icon" height="60" width="60" />
            <Block margin={[0, w3]} flex={false}>
              <Block row center flex={false}>
                <Text semibold size={18} margin={[0, w3, 0, 0]}>
                  {username}
                </Text>
                <ImageComponent name="vehicle_icon" height="25" width="25" />
              </Block>
              <Text margin={[hp(0.5), 0, 0]} size={16} grey>
                {AgentType(agent_type)}
              </Text>
            </Block>
          </Block>
          <Rating rating={0} />
        </Block>
      </Block>
    );
  };
  const renderMissionStatus = () => {
    const values = 'requested';
    return (
      <Block margin={[t1, 0]} flex={false} row center>
        <Block
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
        </Block>
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
      <Text semibold size={18}>
        Payment Details
      </Text>
      <Block flex={false} margin={[t1, 0, 0]}>
        {renderDetails('Amount', `$${amount}`)}
        {renderDetails('Status', PaymentStatus(payment_status))}
        {renderDetails('Due', formatDate(start_date_time))}
      </Block>

      <Button
        onPress={() => openCamera()}
        style={{marginTop: hp(2)}}
        color="primary">
        Upload proof of payment
      </Button>
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
        snapPoint={350}>
        {renderHeader()}
      </Modalize>
    </Block>
  );
};

export default MissionDetails;
