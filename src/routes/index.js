import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screen/splash';
import {AuthStack, HomeStack} from './sub-routes';
import {navigationRef} from './NavigationService';
import CreateMission from '../screen/create-mission';
import ReviewDetails from '../screen/review';
import Payment from '../screen/payment';
import MissionDetails from '../screen/missions/details';
import MissionReport from '../screen/mission-report';
import NewSupport from '../screen/message-center/new-support';
import EditProfile from '../screen/profile/edit-profile';
import ChangePassword from '../screen/auth/change-password';
import Chat from '../screen/message-center/chat';
import ChatOperator from '../screen/message-center/chat/chat-operator';
import Language from '../screen/common/language/language';
import {useDispatch, useSelector} from 'react-redux';
import io from 'socket.io-client';
import {
  getMissionsRequest,
  getNotificationRequest,
  socketConnection,
  missionListRequest,
} from '../redux/action';
import {strictValidObjectWithKeys} from '../utils/commonUtils';
import {onDisplayNotification} from '../utils/site-specific-common-utils';
import {config} from '../utils/config';
import TravelMission from '../screen/missions/travel-mission';
import Planning from '../screen/planning';
import TravelMissionCustomScreen from '../screen/missions/custom-request/travel-mission-custom';
import CustomMissionDetailScreen from '../screen/missions/custom-request/details';
import Available from '../screen/planning/availability';
import Availabilityplus from '../screen/planning/add';

const Stack = createStackNavigator();

function Routes() {
  const userId = useSelector((state) => state.user.profile.user.data);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const socket = io(config.Api_Url);
    socket.on('connect', (a) => {
      dispatch(socketConnection(socket));
    });
    if (strictValidObjectWithKeys(userId) && userId.id) {
      socket.on(`notification_${userId.id}`, (msg) => {
        onDisplayNotification(msg);
        dispatch(getNotificationRequest());
      });
      socket.on(`refresh_feed_${userId.id}`, (msg) => {
        dispatch(getMissionsRequest());
      });
      socket.on(`payment_success_${userId.id}`, (msg) => {
        dispatch(missionListRequest());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Home" component={HomeStack} />
        <Stack.Screen name="CreateMission" component={CreateMission} />
        <Stack.Screen name="ReviewDetails" component={ReviewDetails} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="MissionDetails" component={MissionDetails} />
        <Stack.Screen name="TravelMission" component={TravelMission} />
        <Stack.Screen
          name="TravelMissionCustom"
          component={TravelMissionCustomScreen}
        />
        <Stack.Screen name="MissionReport" component={MissionReport} />
        <Stack.Screen name="NewSupport" component={NewSupport} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="ChatOperator" component={ChatOperator} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="Planning" component={Available} />
        <Stack.Screen name="Availabilityplus" component={Availabilityplus} />

        <Stack.Screen
          name="CustomMissionDetailScreen"
          component={CustomMissionDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
