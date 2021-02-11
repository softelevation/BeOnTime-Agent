/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {Block, Button, ImageComponent, Text} from '../../../components';
import EmptyFile from '../../../components/emptyFile';
import {t1, t2, w3, w5} from '../../../components/theme/fontsize';
import {getMissionsRequest} from '../../../redux/action';
import {strictValidObject} from '../../../utils/commonUtils';
import {divider} from '../../../utils/commonView';
import {AgentType} from '../../../utils/data';
import CommonMap from '../../common/Map';

const InProgress = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const MissionData = useSelector((state) => state.mission.missions.data);
  useEffect(() => {
    dispatch(getMissionsRequest());
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getMissionsRequest());
    });

    return unsubscribe;
  }, []);
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
        {renderRequestReview(item)}
        <Block row space={'around'} flex={false} center>
          <Button
            onPress={() =>
              navigation.navigate('MissionDetails', {
                item: item,
              })
            }
            style={{width: wp(80)}}
            color="secondary">
            Mission details
          </Button>
        </Block>
      </Block>
    );
  };
  const renderAgentDetails = (item) => {
    return (
      <Block margin={[0, w3, t1]} flex={false} row center>
        <ImageComponent name="blurAvatar_icon" height="50" width="50" />
        <Block margin={[0, w3]} flex={false}>
          <Text semibold size={18} margin={[0, w3, 0, 0]}>
            {item.name}
          </Text>
          <Text margin={[hp(0.5), 0, 0]} size={16} grey>
            {AgentType(item.agent_type)}
          </Text>
        </Block>
      </Block>
    );
  };
  const renderRequestReview = () => {
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
                Mission Accepted
              </Text>
              <Text margin={[hp(0.5), 0, 0]} size={14} grey>
                Reaching location in 15 min.
              </Text>
            </>
          </Block>
        </Block>
      </Block>
    );
  };
  return (
    <Block primary>
      <Block padding={[t2, 0]}>
        {strictValidObject(MissionData) && (
          <FlatList
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={<EmptyFile />}
            data={MissionData.missionInProgress}
            renderItem={renderCards}
          />
        )}
      </Block>
    </Block>
  );
};
const circle = {height: 50, width: 50};

export default InProgress;
