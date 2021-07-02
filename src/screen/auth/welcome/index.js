import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Dimensions, ScrollView} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {Block, Button, ImageComponent, Text} from '../../../components';
import {t1, t2, t3} from '../../../components/theme/fontsize';

const WelcomeLogin = () => {
  const navigation = useNavigation();
  const languageMode = useSelector((state) => state.languageReducer.language);
  const {
    RequestSecurity,
    Afewsimple,
    WelcomeDescription,
    WegotCover,
    Getstarted,
    Alreadyaccount,
    LoginHeader,
  } = languageMode;
  return (
    <ScrollView primary>
      <ImageComponent
        name="welcomeMap"
        height="360"
        width={Dimensions.get('screen').width}
      />
      <Block margin={[t3, widthPercentageToDP(10)]} flex={false}>
        <Block flex={false} margin={[t3, 0]}>
          <ImageComponent name="logo" height="50" width="50" />
        </Block>
        <Text semibold size={24}>
          {RequestSecurity}
        </Text>
        <Text semibold size={24}>
          {Afewsimple}
        </Text>
        <Text height={18} margin={[t1, 0]} grey size={16}>
          {WelcomeDescription}
        </Text>
        {/* <Text margin={[t1, 0]} grey size={16}>
          {WegotCover}
        </Text> */}
        <Block flex={false} margin={[t2, 0]}>
          <Block flex={false} margin={[t2, 0]} />
          <Button
            onPress={() => navigation.navigate('Signup')}
            color="secondary">
            {Getstarted}
          </Button>
          <Block flex={false} margin={[t2, 0]}>
            <Text regular height={20} size={18} center>
              {Alreadyaccount}{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                size={18}
                semibold>
                {LoginHeader}
              </Text>
            </Text>
          </Block>
        </Block>
      </Block>
    </ScrollView>
  );
};

export default WelcomeLogin;
