import React, {useEffect, useRef, useState} from 'react';
import {
  Block,
  ImageComponent,
  Text,
  Button,
  CustomButton,
} from '../../components';
import Header from '../../components/common/header';
import {Calendar} from 'react-native-calendars';
import {
  RobotoBold,
  RobotoMedium,
  t1,
  t2,
} from '../../components/theme/fontsize';
import {Modalize} from 'react-native-modalize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import NumberOfHours from '../create-mission/components/hours';
import {strictValidArrayWithLength} from '../../utils/commonUtils';
import {useFocusEffect} from '@react-navigation/native';
import {getPlanningRequest} from '../../redux/planning/action';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const Planning = () => {
  const dispatch = useDispatch();
  const planningDates = useSelector((v) => v.planning.data);
  const [marked, setMarked] = useState([]);
  const modalizeRef = useRef();
  const [fromTimeSelection, setFromTimeSelection] = useState({
    minutes: null,
    hours: null,
  });
  const [ToTimeSelection, setToTimeSelection] = useState({
    minutes: null,
    hours: null,
  });
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [action, setAction] = useState('');

  const renderdata = (value) => {
    let exp = marked;
    if (exp.indexOf(value) > -1) {
      exp = exp.filter((v) => v !== value);
    } else {
      exp.push(value);
    }
    setMarked([...exp]);
  };
  let newDaysObject = {};

  marked.forEach((day) => {
    newDaysObject[day] = {
      selected: true,
      disableTouchEvent: false,
      selectedColor: '#000',
      selectedTextColor: '#fff',
      customStyles: {
        container: {
          color: '#fff',
          height: 48,
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
        },
        text: {
          color: '#fff',
        },
      },
    };
  });
  const onClose = () => {
    modalizeRef.current?.close();
    setAction('');
  };
  const onOpen = (type) => {
    modalizeRef.current?.open();
    setAction(type);
  };
  const submitAvailability = () => {
    const {hours, minutes} = fromTimeSelection;
    const data = {
      schedule_date: marked,
      available_from: `${hours}:${minutes}`,
      available_to: `${ToTimeSelection.hours}:${ToTimeSelection.minutes}`,
    };
    console.log(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getPlanningRequest());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  useEffect(() => {
    let newPlanning = [];
    if (strictValidArrayWithLength(planningDates)) {
      planningDates.map((a) => {
        const scheduleDate = moment(a.schedule_date).format('YYYY-MM-DD');
        newPlanning.push(scheduleDate);
      });
      setMarked(newPlanning);
    }
  }, [planningDates]);
  return (
    <>
      <Header centerText={'Planning'} />
      <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
        <Calendar
          theme={{
            backgroundColor: '#000',
            calendarBackground: '#ffffff',
            todayTextColor: '#000',
            dayTextColor: '#000',
            textDisabledColor: '#d9e1e8',
            monthTextColor: '#000',
            textMonthFontFamily: RobotoMedium,
            textDayHeaderFontFamily: RobotoMedium,
            textDayFontSize: 16,
            textMonthFontSize: 18,
            selectedDayBackgroundColor: '#57B9BB',
            selectedDayTextColor: 'white',
            textDayHeaderFontSize: 12,
            textDayStyle: {
              color: '#000',
            },
            'stylesheet.calendar.header': {
              week: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: '#E9EBF3',
                paddingTop: 20,
                paddingBottom: 20,
                color: '#000',
                marginTop: 10,
                alignItems: 'center',
                marginLeft: 20,
                fontFamily: RobotoBold,
              },
              monthText: {
                fontFamily: RobotoMedium,
                fontSize: 20,
              },
              dayHeader: {
                color: '#000',
              },
            },
            'stylesheet.day.basic': {
              text: {
                marginTop: 15,
              },
              selectedText: {
                marginTop: 5,
              },
              base: {
                height: 48,
              },
            },
          }}
          current={new Date()}
          minDate={new Date()}
          maxDate={'2030-01-01'}
          monthFormat={'MMMM, yyyy'}
          markingType={'custom'}
          markedDates={newDaysObject}
          onDayPress={(day) => {
            renderdata(day.dateString);
          }}
          renderArrow={(direction) => {
            return direction === 'right' ? (
              <ImageComponent name="arrow_right_icon" height="20" width="20" />
            ) : (
              <ImageComponent name="arrow_left_icon" height="20" width="20" />
            );
          }}
          firstDay={1}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          enableSwipeMonths={true}
        />
        <Block flex={false} padding={[0, wp(3)]}>
          <Text margin={[t1, 0]} bold>
            Availability Timing
          </Text>
          <CustomButton
            onPress={() => onOpen('available_from_time')}
            margin={[t1, 0]}
            padding={[hp(0.5), wp(2)]}
            color="#F5F7FA"
            flex={false}>
            <Text margin={[hp(0.5), 0]} grey size={14}>
              Available from (hh:mm)
            </Text>
            <Text margin={[hp(0.5), 0]} grey size={14}>
              {fromTime ? fromTime : ' Select Start Time'}
            </Text>
          </CustomButton>
          <CustomButton
            onPress={() => onOpen('available_to_time')}
            margin={[t1, 0]}
            padding={[hp(0.5), wp(2)]}
            color="#F5F7FA"
            flex={false}>
            <Text margin={[hp(0.5), 0]} grey size={14}>
              Available to (hh:mm)
            </Text>
            <Text margin={[hp(0.5), 0]} grey size={14}>
              {toTime ? toTime : 'Select end Time'}
            </Text>
          </CustomButton>
          <Button
            onPress={() => submitAvailability()}
            disabled={
              !fromTimeSelection.hours ||
              !ToTimeSelection.hours ||
              !strictValidArrayWithLength(marked)
            }
            color="secondary">
            Save schedule
          </Button>
        </Block>
      </KeyboardAwareScrollView>
      <Modalize
        adjustToContentHeight={true}
        handlePosition="inside"
        ref={modalizeRef}>
        {action === 'available_from_time' && (
          <NumberOfHours
            defaultHours={fromTimeSelection.hours}
            defaultMins={fromTimeSelection.minutes}
            setValues={(v, a) => setFromTime(`${v} hours : ${a} minutes`)}
            setTimeData={(a) =>
              setFromTimeSelection((prevState) => ({
                ...prevState,
                hours: a,
              }))
            }
            setMinutesData={(a) =>
              setFromTimeSelection((prevState) => ({
                ...prevState,
                minutes: a,
              }))
            }
            closeModal={() => {
              onClose();
            }}
          />
        )}
        {action === 'available_to_time' && (
          <NumberOfHours
            defaultHours={ToTimeSelection.hours}
            defaultMins={ToTimeSelection.minutes}
            setValues={(v, a) => setToTime(`${v} hours : ${a} minutes`)}
            setTimeData={(a) =>
              setToTimeSelection((prevState) => ({
                ...prevState,
                hours: a,
              }))
            }
            setMinutesData={(a) =>
              setToTimeSelection((prevState) => ({
                ...prevState,
                minutes: a,
              }))
            }
            closeModal={() => {
              onClose();
            }}
          />
        )}
      </Modalize>
    </>
  );
};

export default Planning;
