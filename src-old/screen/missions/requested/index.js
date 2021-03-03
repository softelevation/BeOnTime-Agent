/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../../components';
import Header from '../../../components/common/header';
import EmptyFile from '../../../components/emptyFile';
import {t1, t2, w1, w3, w4, w5} from '../../../components/theme/fontsize';
import {getMissionsRequest} from '../../../redux/action';
import {strictValidObject} from '../../../utils/commonUtils';
import {divider} from '../../../utils/commonView';
import {AgentType} from '../../../utils/data';
import CommonMap from '../../common/Map';

const Requested = () => {
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
  console.log(MissionData, 'MissionData');
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
        <Block flex={false} padding={[0, w3]}>
          <Button color="secondary">Start mission</Button>
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
      <Block margin={[0, w3, t1]} flex={false} row center space="between">
        <Block flex={false} row center>
          <ImageComponent name="blurAvatar_icon" height="50" width="50" />
          <Block margin={[0, w3]} flex={false}>
            <Text semibold size={18} margin={[0, w3, 0, 0]}>
              {item.username}
            </Text>
            <Text margin={[hp(0.5), 0, 0]} size={16} grey>
              {AgentType(item.agent_type)}
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
      <Block padding={[t2, 0]}>
        {strictValidObject(MissionData) && (
          <FlatList
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={<EmptyFile />}
            data={MissionData.missionPending}
            renderItem={renderCards}
          />
        )}
      </Block>
    </Block>
  );
};
const circle = {height: 50, width: 50};

export default Requested;
