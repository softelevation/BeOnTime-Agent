/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
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
import {strictValidNumber} from '../../../utils/commonUtils';
import {divider} from '../../../utils/commonView';
import {PaymentStatus} from '../../../utils/data';
import ActivityLoader from '../../../components/activityLoader';

const Finished = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const MissionData = useSelector((state) => state.mission.missions.data);
  const isLoad = useSelector((state) => state.mission.missions.loading);
  const {missionCompleted} = MissionData;
  const [refreshing, setRefreshing] = useState(false);

  const languageMode = useSelector((state) => state.languageReducer.language);

  const {ViewReport, SubmitReport, MissionDetails} = languageMode;
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
          <Button
            onPress={() =>
              navigation.navigate('MissionReport', {
                item: item,
              })
            }
            color="secondary">
            {strictValidNumber(item.reports_id) ? ViewReport : SubmitReport}
          </Button>
        </Block>
        <CustomButton
          onPress={() =>
            navigation.navigate('MissionDetails', {
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
          color={'#000'}
          flex={false}
          center
          middle
          style={circle}
          borderRadius={30}>
          <Text white size={12} bold>
            100%
          </Text>
        </Block>
        <Block margin={[0, w3]} flex={false}>
          <Block flex={false}>
            <>
              <Text semibold size={16} margin={[0, w3, 0, 0]}>
                Mission Completed
              </Text>
              <Text margin={[hp(0.5), 0, 0]} size={14} grey>
                {/* `{Mission ended. }`PaymentStatus */}
                {`Mission ended. ${PaymentStatus(item.payment_status)}`}
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

      <Block padding={[t2, 0]}>
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
          data={missionCompleted}
          renderItem={renderCards}
        />
      </Block>
    </Block>
  );
};
const circle = {height: 50, width: 50};

export default Finished;
