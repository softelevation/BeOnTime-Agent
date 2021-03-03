import AsyncStorage from '@react-native-community/async-storage';
import {
  StackActions,
  useNavigation,
  NavigationAction,
} from '@react-navigation/native';
import React from 'react';
import {FlatList, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {Block, Button, ImageComponent, Text} from '../../components';
import Header from '../../components/common/header';
import {t1, t5, w3} from '../../components/theme/fontsize';

const Profile = () => {
  const navigation = useNavigation();
  const profile = useSelector((state) => state.user.profile.user.data);
  const onLogout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    navigation.reset({
      routes: [{name: 'Auth'}],
    });
  };

  alert(JSON.stringify(profile))

  console.log("=====>>>>", profile)

  const _renderItem = ({item}) => {
    return (
      <Block
        flex={false}
        row
        space="between"
        padding={[t1]}
        borderWidth={1}
        margin={[t1, 0]}
        borderColorDeafult>
        <Text semibold size={16}>
          {item}
        </Text>
        <ImageComponent name="arrow_right_2_icon" height="20" width="20" />
      </Block>
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
          <Text semibold margin={[t1, 0]}>
            {profile.first_name} {profile.last_name}
          </Text>
          <Text size={16} grey>
            Customer
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
        <Block flex={false} padding={[0, w3]} margin={[t5, 0, 0]}>
          <FlatList
            scrollEnabled={false}
            data={[
              'Billing',
              'Edit profile',
              'Change email',
              'Change password',
            ]}
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
