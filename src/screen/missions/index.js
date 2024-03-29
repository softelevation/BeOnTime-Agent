/* eslint-disable react-hooks/exhaustive-deps */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {Block, Text, CustomButton} from '../../components';
import Header from '../../components/common/header';
import {t2} from '../../components/theme/fontsize';
import {customMissionRequest, getMissionsRequest} from '../../redux/action';

const Missions = ({navigationState}) => {
  const {routes, index} = navigationState;
  const dispatch = useDispatch();
  const selected = index;
  const navigation = useNavigation();
  const languageMode = useSelector((state) => state.languageReducer.language);

  const {
    Accepted,
    Started,
    Finished,
    MissionHeader,
    CustomRequest,
    type,
  } = languageMode;
  const getValues = (name) => {
    if (name === 'Requested') {
      return Accepted;
    }
    if (name === 'InProgress') {
      return Started;
    }
    if (name === 'CustomRequest') {
      return CustomRequest;
    }
    return Finished;
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getMissionsRequest());
      dispatch(customMissionRequest());
    }, []),
  );

  return (
    <Block primary flex={false}>
      <Header centerText={MissionHeader} leftIcon />
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={routes}
        horizontal
        style={{alignSelf: 'center', borderRadius: 30}}
        contentContainerStyle={containerStyle}
        keyExtractor={(item) => item.key}
        renderItem={({item, index}) => {
          return (
            <CustomButton
              onPress={() => navigation.navigate(item.name)}
              center
              middle
              borderRadius={30}
              padding={selected === index ? [hp(1.5), wp(4)] : [hp(1.5), wp(4)]}
              color={selected === index ? '#FFFFFF' : '#F7F8FA'}
              shadow={selected === index}
              margin={[0, wp(1)]}>
              {item.name === 'CustomRequest' && type === 'fr' ? (
                <Text
                  center
                  style={{width: wp(18)}}
                  numberOfLines={2}
                  size={14}
                  semibold>
                  {getValues(item.name)}
                </Text>
              ) : (
                <Text size={14} semibold>
                  {getValues(item.name)}
                </Text>
              )}
            </CustomButton>
          );
        }}
      />
    </Block>
  );
};
const containerStyle = {
  backgroundColor: '#F7F8FA',
  borderRadius: 30,
  marginVertical: t2,
};
export default Missions;
