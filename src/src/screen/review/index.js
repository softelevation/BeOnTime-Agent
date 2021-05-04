import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {Block, Button, ImageComponent, Text} from '../../components';
import Header from '../../components/common/header';
import Rating from '../../components/ratings';
import {light} from '../../components/theme/colors';
import {t1, t2, w3} from '../../components/theme/fontsize';
import {navigate} from '../../routes/NavigationService';
import {
  strictValidArray,
  strictValidObjectWithKeys,
} from '../../utils/commonUtils';
import {divider} from '../../utils/commonView';
import {AgentType, MissionType} from '../../utils/data';
import CommonMap from '../common/Map';

const ReviewDetails = () => {
  const navigation = useNavigation();
  const mission = useSelector(
    (state) => state.agents.bookAgennts.bookAgents.data,
  );
  const {
    id,
    title,
    description,
    intervention,
    agent_type,
    total_hours,
    vehicle_required,
    username,
    agent,
    location,
    total_amount,
    tva,
    vat_percentage,
    total_mission_amount,
  } = strictValidObjectWithKeys(mission) && mission;
  const renderDetails = (header, content) => {
    return (
      <Block center margin={[hp(0.5), 0]} flex={false} row space={'between'}>
        <Text size={16} regular>
          {header}
        </Text>
        <Text regular grey size={16}>
          {content}
        </Text>
      </Block>
    );
  };
  const renderAgentDetails = () => {
    return (
      <Block flex={false}>
        <Text semibold size={18}>
          Agent details
        </Text>
        <Block space={'between'} margin={[t2, 0, t1]} flex={false} row>
          <Block flex={false} row>
            <ImageComponent name="blurAvatar_icon" height="60" width="60" />
            <Block margin={[0, w3]} flex={false}>
              <Block row center flex={false}>
                <Text semibold size={18} margin={[0, w3, 0, 0]}>
                  {agent.username}
                </Text>
                <ImageComponent name="vehicle_icon" height="25" width="25" />
              </Block>
              <Text margin={[hp(0.5), 0, 0]} size={16} grey>
                {AgentType(agent_type)}
              </Text>
            </Block>
          </Block>
          <Rating rating={0} />
        </Block>
      </Block>
    );
  };
  return (
    <Block primary>
      <Header centerText="Review Details" />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: light.primary}}>
        <Block padding={[t2, w3]}>
          <Text grey size={16}>
            Please review filled details carefully before proceeding to the
            final payment.
          </Text>
          <Block margin={[t2, 0, 0]} style={{height: hp(20)}} secondary>
            <CommonMap />
          </Block>
          <Block flex={false} margin={[t2, 0, 0]}>
            <Text size={13} grey semibold>
              MISN0{id}
            </Text>
            <Text margin={[t1, 0, 0]} semibold size={20}>
              {title}
            </Text>
            <Text grey body margin={[t1, 0, 0]}>
              {description}
            </Text>
            {divider()}
            <Text semibold size={18}>
              Mission details
            </Text>
            <Block flex={false} margin={[t2, 0, 0]}>
              {renderDetails('Mission type', MissionType(intervention))}
              {renderDetails('Agent type', AgentType(agent_type))}
              {renderDetails('Location', location)}
              {renderDetails('Duration', `${total_hours} hours`)}
              {renderDetails(
                'Vehicle required',
                vehicle_required === 1 ? 'Yes' : 'No',
              )}
            </Block>
            {divider()}
            {renderAgentDetails()}
            {divider()}
            <Text semibold size={18}>
              Payment details
            </Text>
            <Block flex={false} margin={[t2, 0]}>
              {renderDetails('Agent cost', `$${total_amount}`)}
              {renderDetails(`TVA (${vat_percentage}%)`, `$${tva}`)}
              {renderDetails('Total amount', `$${total_mission_amount}`)}
            </Block>

            <Block flex={false}>
              <Button
                onPress={() => navigation.navigate('Payment')}
                color="secondary">
                Proceed to payment
              </Button>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default ReviewDetails;
