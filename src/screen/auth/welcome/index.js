import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Dimensions, ScrollView} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Block, Button, ImageComponent, Text} from '../../../components';
import {t1, t2, t3} from '../../../components/theme/fontsize';

const WelcomeLogin = () => {
  const navigation = useNavigation();
  return (
    <ScrollView primary>
      <ImageComponent
        name="welcomeMap"
        height="360"
        width={Dimensions.get('screen').width}
      />
      <Block margin={[t3, widthPercentageToDP(10)]} flex={false}>
        <Text semibold size={26}>
          Request security agent in
        </Text>
        <Text semibold size={26}>
          a few simple clicks
        </Text>
        <Text height={18} margin={[t1, 0]} grey size={16}>
          Need to ensure the security of a site, surveillance of a parking lot,
          protection of a store, or prevention of fire risks in public
          establishments?
        </Text>
        <Text margin={[t1, 0]} grey size={16}>
          We got you covered.
        </Text>
        <Block flex={false} margin={[t2, 0]}>
          <Block flex={false} margin={[t2, 0]} />
          <Button
            onPress={() => navigation.navigate('Signup')}
            color="secondary">
            Get started
          </Button>
          <Block flex={false} margin={[t2, 0]}>
            <Text regular height={20} size={18} center>
              Already have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                size={18}
                semibold>
                Log in.
              </Text>
            </Text>
          </Block>
        </Block>
      </Block>
    </ScrollView>
  );
};

export default WelcomeLogin;
