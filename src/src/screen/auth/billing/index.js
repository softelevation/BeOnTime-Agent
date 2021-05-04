import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {Block, Text} from '../../../components';
import ActivityLoader from '../../../components/activityLoader';
import Header from '../../../components/common/header';
import EmptyFile from '../../../components/emptyFile';
import {t1, t2, t4, w2, w3} from '../../../components/theme/fontsize';
import {getMissionsRequest} from '../../../redux/action';
import {strictValidArrayWithLength} from '../../../utils/commonUtils';
import {PaymentStatus} from '../../../utils/data';

const Billing = () => {
  const dispatch = useDispatch();
  const MissionData = useSelector((state) => state.mission.missions.data);
  const isLoad = useSelector((state) => state.mission.missions.loading);

  useEffect(() => {
    dispatch(getMissionsRequest());
  }, []);

  const _renderItem = ({item}) => {
    return (
      <Block
        margin={[t1, 0, 0]}
        padding={[t1]}
        borderWidth={[0, 0, 1, 0]}
        borderColorDeafult
        flex={false}>
        <Block flex={false} row center space="between" padding={[0, w2]}>
          <Block flex={false}>
            <Text grey size={12}>
              MISN0{item.id}
            </Text>
            <Text margin={[heightPercentageToDP(0.5), 0, 0]} regular size={16}>
              {item.title}
            </Text>
          </Block>
          <Text semibold>€{item.amount}</Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0, 0]}
          padding={[0, w2]}
          center>
          <Text size={16}>Status</Text>
          <Text grey size={16}>
            {PaymentStatus(item.payment_status)}
          </Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0, 0]}
          padding={[0, w2]}
          center>
          <Text size={16}>Date</Text>
          <Text right grey size={16}>
            {'18/11/2020 16:42:26'}
          </Text>
        </Block>
      </Block>
    );
  };
  return (
    <Block white>
      <Header centerText="Billing" />
      {isLoad && <ActivityLoader />}
      {strictValidArrayWithLength(MissionData.mission_all) ? (
        <FlatList
          contentContainerStyle={{paddingBottom: t4}}
          data={MissionData.mission_all}
          renderItem={_renderItem}
        />
      ) : (
        <EmptyFile text="Purchase history not found" />
      )}
    </Block>
  );
};

export default Billing;
