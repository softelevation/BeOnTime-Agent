import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screen/splash';
import {AuthStack, HomeStack} from './sub-routes';
import {navigationRef} from './NavigationService';
import CreateMission from '../screen/create-mission';
import ChooseType from '../screen/choose-type';
import ReviewDetails from '../screen/review';
import Payment from '../screen/payment';
import MissionDetails from '../screen/missions/details';
const Stack = createStackNavigator();

function Routes() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Home" component={HomeStack} />
        <Stack.Screen name="CreateMission" component={CreateMission} />
        <Stack.Screen name="ChooseType" component={ChooseType} />
        <Stack.Screen name="ReviewDetails" component={ReviewDetails} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="MissionDetails" component={MissionDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;