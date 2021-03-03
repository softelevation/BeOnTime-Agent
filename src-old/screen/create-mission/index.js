import {Formik} from 'formik';
import React, {useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Input,
  Text,
} from '../../components';
import Header from '../../components/common/header';
import {t1, t4, w1, w3, w4} from '../../components/theme/fontsize';
import * as yup from 'yup';
import {Modalize} from 'react-native-modalize';
import MissionType from './components/mission-type';
import AgentType from './components/agent-type';
import NumberOfHours from './components/hours';
import ChooseDateTime from './components/choosedatetime';
import {useDispatch, useSelector} from 'react-redux';
import {searchAgentsRequest} from '../../redux/action';
import moment from 'moment';
const CreateMission = () => {
  const formikRef = useRef();
  const modalizeRef = useRef();
  const dispatch = useDispatch();
  const [action, setAction] = useState('');
  const location = useSelector((state) => state.common.location.data);
  const isLoad = useSelector((state) => state.agents.searchAgentList.loading);
  console.log(isLoad);
  var CurrentDate = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(CurrentDate, 'CurrentDate');
  const onSubmit = (values) => {
    const data = {
      title: values.title,
      location: values.location,
      latitude: location.latitude,
      longitude: location.longitude,
      intervention: values.mission_type.value,
      agent_type: values.agent_type.value,
      total_hours: values.total_hours,
      quick_book: values.type === 'now' ? 1 : 0,
      start_date_time: values.start_date
        ? `${values.start_date}${values.start_time + ':00'}`
        : `${CurrentDate}`,
      description: values.description,
      vehicle_required: values.preferVehicle ? 1 : 2,
    };
    console.log(data, 'data');
    dispatch(searchAgentsRequest(data));
  };

  const onOpen = (type) => {
    modalizeRef.current?.open();
    setAction(type);
  };
  const onClose = (type) => {
    modalizeRef.current?.close();
    setAction('');
  };

  const renderType = (label, description, onPress, value) => {
    return (
      <CustomButton
        onPress={onPress}
        margin={[t1, 0]}
        borderWidth={1}
        borderColor={'#F5F7FA'}
        flex={false}
        space={'between'}
        padding={[t1]}
        center
        row>
        <Block flex={false}>
          <Text color="#8A8E99" caption>
            {label}
          </Text>
          <Text bold color="#8A8E99" margin={[t1, 0, 0, 0]} size={16}>
            {value || description}
          </Text>
        </Block>
        <ImageComponent name="down_arrow_icon" height="8" width="14" />
      </CustomButton>
    );
  };
  return (
    <Block safearea white>
      <Header centerText="Create Mission" />
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          type: 'now',
          start_date: '',
          start_time: '',
          title: '',
          location: '',
          description: '',
          mission_type: {
            name: '',
            value: '',
          },
          agent_type: {
            name: '',
            value: '',
          },
          total_hours: null,
          preferVehicle: true,
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          title: yup.string().min(2).required(),
          agent_type: yup.object().shape({
            name: yup.string().required(),
          }),
          mission_type: yup.object().shape({
            name: yup.string().required(),
          }),
          total_hours: yup.string().required(),
          description: yup.string().min(2).required(),
          location: yup.string().min(2).required(),
        })}>
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
                contentContainerStyle={{flexGrow: 1}}>
                <Block padding={[0, w4]}>
                  <Block
                    // space={'between'}
                    center
                    margin={[t1, w3]}
                    row
                    flex={false}>
                    <Text
                      size={16}
                      style={{width: widthPercentageToDP(45)}}
                      regular>
                      When do you want the mission to start?
                    </Text>

                    <Block
                      primary
                      margin={[0, w4, 0, 0]}
                      color={'#F7F8FA'}
                      borderRadius={30}
                      row
                      flex={false}>
                      <CustomButton
                        onPress={() => setFieldValue('type', 'now')}
                        center
                        middle
                        borderRadius={30}
                        padding={
                          values.type === 'now'
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={values.type === 'now' ? '#FFFFFF' : '#F7F8FA'}
                        shadow={values.type === 'now'}
                        margin={[0, w1]}>
                        <Text size={14} semibold>
                          Now
                        </Text>
                      </CustomButton>
                      <CustomButton
                        onPress={() => setFieldValue('type', 'later')}
                        center
                        middle
                        borderRadius={20}
                        padding={
                          values.type === 'later'
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(6)]
                        }
                        color={values.type === 'later' ? '#FFFFFF' : '#F7F8FA'}
                        shadow={values.type === 'later'}>
                        <Text size={14} semibold>
                          Later
                        </Text>
                      </CustomButton>
                    </Block>
                  </Block>
                  {values.type === 'later' && (
                    <>
                      {renderType(
                        'Date and time',
                        'Select mission date and time',
                        () => onOpen('date_time'),
                        `${values.start_date}${values.start_time}`,
                      )}
                    </>
                  )}
                  <Input
                    label="Title"
                    placeholder="Enter mission title"
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={() => setFieldTouched('title')}
                    error={touched.title && errors.title}
                  />
                  <Input
                    label="Location"
                    placeholder="Enter mission location"
                    value={values.location}
                    onChangeText={handleChange('location')}
                    onBlur={() => setFieldTouched('location')}
                    error={touched.location && errors.location}
                  />
                  <Input
                    label="Description"
                    placeholder="Enter mission description"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={() => setFieldTouched('description')}
                    error={touched.description && errors.description}
                  />
                  {renderType(
                    'Mission type',
                    'Select mission type',
                    () => onOpen('mission'),
                    values.mission_type.name,
                  )}
                  {renderType(
                    'Agent type',
                    'Select agent type',
                    () => onOpen('agent'),
                    values.agent_type.name,
                  )}
                  {renderType(
                    'Mission duration',
                    'Select number of hours',
                    () => onOpen('duration'),
                    values.total_hours,
                  )}
                  <Block margin={[t1, w3]} flex={false} row>
                    <ImageComponent
                      name="warning_icon"
                      height="20"
                      width="20"
                    />
                    <Text
                      style={{width: widthPercentageToDP(70)}}
                      margin={[0, w3]}
                      color="#8A8E99"
                      size={12}>
                      Note: If you don’t know how many hours the mission will
                      take, by default you are being charged for 8 hours.
                    </Text>
                  </Block>

                  <Block
                    // space={'between'}
                    center
                    margin={[t1, w3]}
                    row
                    flex={false}>
                    <Text
                      size={16}
                      style={{width: widthPercentageToDP(40)}}
                      regular>
                      Do you prefer an agent to have a vehicle?
                    </Text>

                    <Block
                      primary
                      // padding={[t1]}
                      margin={[0, w4, 0, w4]}
                      color={'#F7F8FA'}
                      borderRadius={30}
                      row
                      flex={false}>
                      <CustomButton
                        onPress={() => setFieldValue('preferVehicle', true)}
                        center
                        middle
                        borderRadius={30}
                        padding={
                          values.preferVehicle
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(8)]
                        }
                        color={values.preferVehicle ? '#FFFFFF' : '#F7F8FA'}
                        shadow={values.preferVehicle}
                        margin={[0, w1]}>
                        <Text size={14} semibold>
                          Yes
                        </Text>
                      </CustomButton>
                      <CustomButton
                        onPress={() => setFieldValue('preferVehicle', false)}
                        center
                        middle
                        borderRadius={20}
                        padding={
                          !values.preferVehicle
                            ? [
                                heightPercentageToDP(1.5),
                                widthPercentageToDP(8),
                              ]
                            : [0, widthPercentageToDP(8)]
                        }
                        color={!values.preferVehicle ? '#FFFFFF' : '#F7F8FA'}
                        shadow={!values.preferVehicle}>
                        <Text size={14} semibold>
                          No
                        </Text>
                      </CustomButton>
                    </Block>
                  </Block>
                  <Button
                    isLoading={isLoad}
                    disabled={!isValid || !dirty}
                    onPress={handleSubmit}
                    style={{marginVertical: t4}}
                    color="secondary">
                    Search for agents
                  </Button>
                </Block>
              </KeyboardAwareScrollView>
              <Modalize
                adjustToContentHeight={true}
                handlePosition="inside"
                ref={modalizeRef}>
                {action === 'mission' && (
                  <MissionType
                    state={values.mission_type}
                    setValues={(v) => setFieldValue('mission_type', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'agent' && (
                  <AgentType
                    state={values.agent_type}
                    setValues={(v) => setFieldValue('agent_type', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'duration' && (
                  <NumberOfHours
                    state={values.total_hours}
                    setValues={(v) => setFieldValue('total_hours', `${v}`)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'date_time' && (
                  <ChooseDateTime
                    dateState={values.start_date}
                    setDateValues={(v) => setFieldValue('start_date', v)}
                    timeState={values.start_time}
                    setTimeValues={(v) => setFieldValue('start_time', ` ${v}`)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
              </Modalize>
            </>
          );
        }}
      </Formik>
    </Block>
  );
};

export default CreateMission;
