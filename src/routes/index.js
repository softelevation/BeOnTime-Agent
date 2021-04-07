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
import MissionReport from '../screen/mission-report';
import NewSupport from '../screen/message-center/new-support';
import EditProfile from '../screen/profile/edit-profile';
import ChangePassword from '../screen/auth/change-password';
import Chat from '../screen/message-center/chat';

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
        <Stack.Screen name="MissionReport" component={MissionReport} />
        <Stack.Screen name="NewSupport" component={NewSupport} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
