import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {images} from '../../../assets';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../../components';
import StarRating from '../../../components/ratings';
import {light} from '../../../components/theme/colors';
import {t1, t2, t3, w1, w2, w3, w5} from '../../../components/theme/fontsize';
import {bookAgentRequest} from '../../../redux/action';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
} from '../../../utils/commonUtils';
import {AgentType} from '../../../utils/data';

const AgentList = ({data}) => {
  const [details, setdetails] = useState({});
  const navigation = useNavigation();
  const mission = useSelector(
    (state) => state.agents.searchAgentList.searchList.data,
  );
  const isLoad = useSelector((state) => state.agents.bookAgennts.loading);

  const dispatch = useDispatch();

  const bookAgents = (agent_id) => {
    const newData = {
      agent_id: agent_id,
      mission_id: mission.id,
    };
    dispatch(bookAgentRequest(newData));
  };
  const _renderItem = ({item}) => {
    return (
      <Block
        borderWidth={1}
        borderColorDeafult
        shadow
        primary
        margin={[t2, w3, t2, w2]}
        padding={[t2]}
        style={{width: wp(70)}}
        flex={false}>
        <Block center row>
          <ImageComponent name="blurAvatar_icon" height="60" width="60" />
          <Block margin={[0, w3]} flex={false}>
            <Block row center flex={false}>
              <Text
                style={{maxWidth: wp(30)}}
                semibold
                size={18}
                margin={[0, w3, 0, 0]}>
                {item.username}
              </Text>
              <ImageComponent name="vehicle_icon" height="25" width="25" />
            </Block>
            <Text margin={[hp(0.5), 0, 0]} size={16} grey>
              {item.distance.toFixed(1)} km
            </Text>
          </Block>
        </Block>
        <Block
          flex={false}
          margin={[t1, 0, t1, 0]}
          borderWidth={[0, 0, 1, 0]}
          borderColorDeafult
        />
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Type
          </Text>
          <Text grey size={16}>
            {AgentType(item.agent_type)}
          </Text>
        </Block>
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Rating
          </Text>
          <StarRating rating={0} />
        </Block>
        <Block margin={[hp(0.5), w1]} space="between" row flex={false}>
          <Text size={16} regular>
            Location
          </Text>
          <Text style={{width: wp(40)}} right grey size={16}>
            {item.work_location_address}
          </Text>
        </Block>
        <Block row space={'around'} flex={false} center>
          <Text onPress={() => setdetails(item)} size={18} semibold>
            Details
          </Text>
          <Button
            isLoading={isLoad}
            onPress={() => bookAgents(item.id)}
            style={{width: wp(35)}}
            color="secondary">
            Choose agent
          </Button>
        </Block>
      </Block>
    );
  };
  const _renderAgents = () => {
    return (
      <Block>
        {strictValidArrayWithLength(data) ? (
          <>
            <Text semibold>Found {data && data.length} agents nearby</Text>
            <Text regular size={18} grey height={30}>
              Select an appropriate security agent.
            </Text>
          </>
        ) : (
          <Text size={16} semibold errorColor>
            Please choose different Agent{' '}
          </Text>
        )}
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={data && data}
          horizontal
          renderItem={_renderItem}
          pagingEnabled
        />
      </Block>
    );
  };
  const _renderAgentDetails = () => {
    const {
      username,
      id,
      distance,
      agent_type,
      work_location_address,
      is_vehicle,
    } = strictValidObjectWithKeys(details) && details;
    return (
      <Block flex={false}>
        <Block row>
          <CustomButton
            onPress={() => setdetails(false)}
            flex={false}
            margin={[0, w5, 0, 0]}>
            <ImageComponent name="back_arrow_icon" height="20" width="20" />
          </CustomButton>
          <ImageComponent name="blurAvatar_icon" height="60" width="60" />
          <Block margin={[0, w3]} flex={false}>
            <Block row center flex={false}>
              <Text
                style={{maxWidth: wp(30)}}
                semibold
                size={18}
                margin={[0, w3, 0, 0]}>
                {username}
              </Text>
              <ImageComponent name="vehicle_icon" height="25" width="25" />
            </Block>
            <Text margin={[hp(0.5), 0, 0]} size={16} grey>
              {distance.toFixed(1)} km
            </Text>
          </Block>
        </Block>
        <Block
          flex={false}
          margin={[t1, 0, t1, 0]}
          borderWidth={[0, 0, 1, 0]}
          borderColorDeafult
        />
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Completed missions
          </Text>
          <Text grey size={16}>
            20
          </Text>
        </Block>
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Hours clocked
          </Text>
          <Text grey size={16}>
            112
          </Text>
        </Block>
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Has vehicle
          </Text>
          <Text grey size={16}>
            {is_vehicle === 1 ? 'Yes' : 'No'}
          </Text>
        </Block>
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Type
          </Text>
          <Text grey size={16}>
            {AgentType(agent_type)}
          </Text>
        </Block>
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Rating
          </Text>
          <StarRating rating={0} />
        </Block>
        <Block margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Text size={16} regular>
            Location
          </Text>
          <Text style={{width: wp(60)}} right grey size={16}>
            {work_location_address}
          </Text>
        </Block>
        <Block center margin={[hp(0.5), 0]} space="between" row flex={false}>
          <Block>
            <Text size={16} regular>
              Documents
            </Text>
            <Text grey size={14} regular>
              1 files uploaded
            </Text>
          </Block>
          <Block row flex={false}>
            {/* <ImageComponent name="doc_icon" height="40" width="40" /> */}
            <ImageComponent name="doc_icon" height="40" width="40" />
          </Block>
        </Block>

        <Button
          isLoading={isLoad}
          onPress={() => bookAgents(id)}
          color="secondary">
          Choose agent
        </Button>
      </Block>
    );
  };
  return (
    <Block padding={[t3, w5]}>
      {strictValidObjectWithKeys(details) ? (
        <>{_renderAgentDetails()}</>
      ) : (
        <>{_renderAgents()}</>
      )}
    </Block>
  );
};

export default AgentList;
