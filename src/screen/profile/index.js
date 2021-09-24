import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../components';
import Header from '../../components/common/header';
import {t1, t5, w3} from '../../components/theme/fontsize';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/commonUtils';
import {config} from '../../utils/config';
import messaging from '@react-native-firebase/messaging';
import {resetStore} from '../../redux/action';
import axios from 'axios';

const Profile = () => {
  const navigation = useNavigation();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.user.profile.user.data);
  const languageMode = useSelector((state) => state.languageReducer.language);
  const {
    ProfileLanguage,
    CompletedMissions,
    EditProfileLanguage,
    Email,
    HomeAddress,
    PhoneNumber,
    Planning,
    ChangeLanguage,
    ChangePassword,
    Logout,
    HoursClocked,
  } = languageMode;
  const [profile, setProfile] = useState();
  useEffect(() => {
    setProfile(profileData);
  }, [profileData]);
  const onLogout = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('token');
    const language = await AsyncStorage.getItem('language');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
      language: language,
    };
    await messaging().deleteToken(undefined, '*');
    const response = await axios({
      method: 'get',
      url: `${config.Api_Url}/log-out`,
      headers,
    });
    if (response.data.status === 1) {
      const keys = await AsyncStorage.getAllKeys();
      dispatch(resetStore());
      await AsyncStorage.multiRemove(keys);
      navigation.reset({
        routes: [{name: 'Auth'}],
      });
      setloading(false);
    }
  };

  const ProfileData = [
    {
      name: Planning,
      nav: 'Planning',
    },
    {
      name: EditProfileLanguage,
      nav: 'EditProfile',
    },
    {
      name: ChangeLanguage,
      nav: 'Language',
    },
    {
      name: ChangePassword,
      nav: 'ChangePassword',
    },
  ];

  const _renderItem = ({item}) => {
    return (
      <CustomButton
        onPress={() => navigation.navigate(item.nav)}
        flex={false}
        row
        space="between"
        padding={[t1]}
        borderWidth={1}
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
      <Header leftIcon={true} menu centerText={ProfileLanguage} />
      {strictValidObjectWithKeys(profile) && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block margin={[t1, 0]} flex={false} center>
            {strictValidObjectWithKeys(profile) &&
            strictValidString(profile.image) ? (
              <ImageComponent
                isURL
                name={`${config.Api_Url}/${profile.image}`}
                height="150"
                width="150"
                radius={150}
              />
            ) : (
              <ImageComponent
                name="default_profile_icon"
                height="150"
                width="150"
              />
            )}
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
            <Text size={16}>{Email}</Text>
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
            <Text size={16}>{PhoneNumber}</Text>
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
            <Text size={16}>{HomeAddress}</Text>
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
            <Text size={16}>{CompletedMissions}</Text>
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
            <Text size={16}>{HoursClocked}</Text>
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
            <Button
              isLoading={loading}
              onPress={() => onLogout()}
              color="secondary">
              {Logout}
            </Button>
          </Block>
        </ScrollView>
      )}
    </Block>
  );
};

export default Profile;
