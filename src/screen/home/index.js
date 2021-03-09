/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../components';
// import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { images } from '../../assets';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { t1, t2, w1, w3, w4, w5 } from '../../components/theme/fontsize';
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import SearchFilters from './components/SearchFilters';
import { useDispatch, useSelector } from 'react-redux';
import {
  agentslistRequest,
  locationSuccess,
  profileRequest
} from '../../redux/action';
import Header from '../../components/common/header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { Formik } from 'formik';
import EmptyFile from '../../components/emptyFile';
import CommonMap from '../common/Map';
import { divider } from '../../utils/commonView';
import { AgentType } from '../../utils/data';
import AsyncStorage from '@react-native-community/async-storage';
import CommonApi from "../../utils/CommonApi";


const Home = () => {
  const navigation = useNavigation();

  const modalizeRef = useRef(null);
  const Profileeee = useSelector((state) => state);
  const [agentList, setAgentList] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileRequest());
    CommonApi.fetchAppCommon('/agent/mission-requests', 'GET', '').then(
      response => {
        if (response.status == 1) {
          setAgentList(response.data)
        }

      }).catch(err => {
        console.log("mission-requests===>>", err)
      })

  }, []);

  useEffect(() => {
    const watchId = Geolocation.getCurrentPosition(
      (position) => {
        dispatch(locationSuccess(position.coords));
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  const onSubmit = () => { };

  const renderAgentDetails = (item) => {
    return (
      <Block margin={[0, w3, t1]} flex={false} row space="between">
        <Block flex={false} row center>
          <ImageComponent name="blurAvatar_icon" height="50" width="50" />
          <Block margin={[0, w3]} flex={false}>
            <Text semibold size={18} margin={[0, w3, 0, 0]}>
              {item.title}
            </Text>
            <Text margin={[hp(0.5), 0, 0]} size={16} grey>
              {AgentType(item.agent_type)}
            </Text>
          </Block>
        </Block>
        <Block
          color={'#F7F8FA'}
          flex={false}
          center
          middle
          style={circle}
          borderRadius={30}>
          <Text size={12} bold>
            2:30
          </Text>
        </Block>
      </Block>
    );
  };

  const acceptMission = (item) => {
    navigation.navigate('MissionDetails', { item: item })

    // var parm = {
    //   "status": 3,
    // }
    // CommonApi.fetchAppCommon('/agent/mission-request/' + item.id, 'POST', JSON.stringify(parm)).then(
    //   response => {
    //     if (response.status == 1) {
    //       navigation.navigate('MissionDetails', { item: item })
    //     }

    //   }).catch(err => {
    //     console.log("missionRequest===>>", err)
    //   })

  }

  const rejectMission = (item) => {
    navigation.navigate('MissionDetails', { item: item })

    // var parm = {
    //   "status": 2,
    // }
    // CommonApi.fetchAppCommon('/agent/mission-request/' + item.id, 'POST', JSON.stringify(parm)).then(
    //   response => {
    //     if (response.status == 1) {
    //       navigation.navigate('MissionDetails', { item: item })
    //     }

    //   }).catch(err => {
    //     console.log("missionRequest===>>", err)
    //   })


  }

  const renderCards = ({ item, index }) => {
    return (
      <Block
        shadow
        primary
        margin={[0, w5, t2]}
        padding={[0, 0, t2, 0]}
        borderRadius={10}>
        <Block margin={[0, 0, t2]} style={{ height: hp(15) }} secondary>
          <CommonMap />
        </Block>
        <Block padding={[0, w3]}>
          <Text semibold grey size={14}>
            MISN0{item.agent_id}
          </Text>
          <Text margin={[hp(0.5), 0]} size={16} semibold>
            {item.title}
          </Text>
        </Block>
        {divider()}
        {renderAgentDetails(item)}
        {/* {renderRequestReview(item)} */}
        <Block row space={'around'} flex={false} center>
          <Button
            style={{ width: wp(40) }}
            onPress={() => rejectMission(item)}
            color="primary">
            Reject
          </Button>
          <Button
            style={{ width: wp(40) }}
            onPress={() => acceptMission(item)}
            color="secondary">
            Accept
          </Button>
        </Block>
        <CustomButton margin={[t1, 0]} center>
          <Text semibold size={14}>
            Mission Details
          </Text>
        </CustomButton>
      </Block>
    );
  };
  return (
    <Block primary>
      <Header centerText="Mission Requests" leftIcon />
      <Formik
        enableReinitialize
        initialValues={{
          type: 'yes',
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({})}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          setFieldValue,
          handleSubmit,
          dirty,
          isValid,
        }) => {
          return (
            <>
              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}>
                <Block flex={false} padding={[0, w4]}>
                  <Block
                    // space={'between'}
                    center
                    margin={[t1, w3]}
                    row
                    flex={false}>
                    <Text
                      size={16}
                      style={{ width: widthPercentageToDP(45) }}
                      regular>
                      Accepting new mission requests?
                    </Text>

                    <Block
                      primary
                      margin={[0, w4, 0, 0]}
                      color={'#F7F8FA'}
                      borderRadius={30}
                      row
                      flex={false}>
                      <CustomButton
                        onPress={() => setFieldValue('type', 'yes')}
                        center
                        middle
                        borderRadius={30}
                        padding={
                          values.type === 'yes'
                            ? [
                              heightPercentageToDP(1.5),
                              widthPercentageToDP(8),
                            ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={values.type === 'yes' ? '#FFFFFF' : '#F7F8FA'}
                        shadow={values.type === 'yes'}
                        margin={[0, w1]}>
                        <Text size={14} semibold>
                          Yes
                        </Text>
                      </CustomButton>
                      <CustomButton
                        onPress={() => setFieldValue('type', 'no')}
                        center
                        middle
                        borderRadius={20}
                        padding={
                          values.type === 'no'
                            ? [
                              heightPercentageToDP(1.5),
                              widthPercentageToDP(8),
                            ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={values.type === 'no' ? '#FFFFFF' : '#F7F8FA'}
                        shadow={values.type === 'no'}>
                        <Text size={14} semibold>
                          No
                        </Text>
                      </CustomButton>
                    </Block>
                  </Block>
                </Block>
                <Block flex={false} margin={[t1, 0, 0]}>
                  <FlatList
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<EmptyFile />}
                    data={agentList}
                    // data={[
                    //   { id: 1, title: 'Ha', agent_type: 2, name: 'user122' },
                    //   { id: 1, title: 'Na', agent_type: 3, name: 'user122' },
                    // ]}
                    renderItem={renderCards}
                  />
                </Block>
              </KeyboardAwareScrollView>
            </>
          );
        }}
      </Formik>
    </Block>
  );
};
const circle = { height: 50, width: 50 };

export default Home;
