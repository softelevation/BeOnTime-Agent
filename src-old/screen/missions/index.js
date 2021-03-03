import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Block, Text, CustomButton} from '../../components';
import Header from '../../components/common/header';
import {t2, w4} from '../../components/theme/fontsize';

const Missions = ({navigationState}) => {
  const {routes, index} = navigationState;
  console.log(navigationState, 'navigationState');
  const selected = index;
  const navigation = useNavigation();
  const getValues = (name) => {
    if (name === 'Requested') {
      return 'Accepted';
    }
    if (name === 'InProgress') {
      return 'Started';
    }
    return 'Finished';
  };

  return (
    <Block primary flex={false}>
      <Header centerText="Missions" leftIcon />
      <FlatList
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
              <Text size={14} semibold>
                {getValues(item.name)}
              </Text>
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
