import AsyncStorage from '@react-native-community/async-storage';
import {
  StackActions,
  useNavigation,
  NavigationAction,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../components';
import Header from '../../components/common/header';
import {t1, t5, w3} from '../../components/theme/fontsize';
import CommonApi from '../../utils/CommonApi';
import {ProfileData} from '../../utils/data';

const Profile = () => {
  const navigation = useNavigation();
  // const profile = useSelector((state) => state.user.profile.user.data);
  const [profile, setProfileData] = useState({});

  const onLogout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    navigation.reset({
      routes: [{name: 'Auth'}],
    });
  };

  useEffect(() => {
    CommonApi.fetchAppCommon('/profile', 'GET', '')
      .then((response) => {
        if (response.status == 1) {
          setProfileData(response.data);
        }
      })
      .catch((err) => {});
  }, []);

  const _renderItem = ({item}) => {
    return (
      <CustomButton
        onPress={() => navigation.navigate(item.nav)}
        flex={false}
        row
        space="between"
        padding={[t1]}
        borderWidth={1}
        // margin={[t1, 0]}
        borderColorDeafult>
        <Text semibold size={16}>
          {item.name}
        </Text>
        <ImageComponent name="arrow_right_2_icon" height="20" width="20" />
      </CustomButton>
    );
  };
  return (
    <Block white>
      <Header leftIcon={true} menu centerText={'Profile'} />
      <ScrollView>
        <Block margin={[t1, 0]} flex={false} center>
          <ImageComponent
            name="default_profile_icon"
            height="150"
            width="150"
          />
          <Text transform="capitalize" semibold margin={[t1, 0]}>
            {profile.first_name} {profile.last_name}
          </Text>
          <Text size={16} grey>
            {profile.type}
          </Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Email</Text>
          <Text grey size={16}>
            {profile.email}
          </Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Phone number</Text>
          <Text grey size={16}>
            {profile.phone}
          </Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Address</Text>
          <Text grey size={16}>
            {profile.home_address}
          </Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Completed missions</Text>
          <Text grey size={16}>
            {profile.mission_completed}
          </Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Hours clocked</Text>
          <Text grey size={16}>
            {profile.mission_time}
          </Text>
        </Block>
        <Block flex={false} padding={[0, w3]} margin={[t5, 0, 0]}>
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
              paddingBottom: heightPercentageToDP(4),
              paddingTop: heightPercentageToDP(2),
            }}
            data={ProfileData}
            renderItem={_renderItem}
          />
          <Button onPress={() => onLogout()} color="secondary">
            Log Out
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default Profile;
