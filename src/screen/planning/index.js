import React, {useRef, useState} from 'react';
import {Block, ImageComponent, Text, Button} from '../../components';
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

const Planning = () => {
  const [marked, setMarked] = useState([]);
  const modalizeRef = useRef();
  const [action, setAction] = useState('');
  const renderdata = (value) => {
    let exp = marked;
    console.log(exp.indexOf(value) > -1, 'exp.indexOf(value) > -1');
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
  return (
    <Block primary>
      <Header centerText={'Planning'} />
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
        <Block
          margin={[t1, 0]}
          padding={[hp(0.5), wp(2)]}
          color="#F5F7FA"
          flex={false}>
          <Text margin={[hp(0.5), 0]} grey size={14}>
            Available from (hh:mm)
          </Text>
          <Text margin={[hp(0.5), 0]} grey size={14}>
            Select Start Time
          </Text>
        </Block>
        <Block
          margin={[t1, 0]}
          padding={[hp(0.5), wp(2)]}
          color="#F5F7FA"
          flex={false}>
          <Text margin={[hp(0.5), 0]} grey size={14}>
            Available to (hh:mm)
          </Text>
          <Text margin={[hp(0.5), 0]} grey size={14}>
            Select end Time
          </Text>
        </Block>
        <Button color="secondary">Save schedule</Button>
      </Block>
      <Modalize
        adjustToContentHeight={true}
        handlePosition="inside"
        ref={modalizeRef}>
        {/* {action === 'date_time' && (
          <ChooseDateTime
            dateState={values.start_date}
            setDateValues={(v) => setFieldValue('start_date', v)}
            timeState={values.start_time}
            setTimeValues={(v) => setFieldValue('start_time', ` ${v}`)}
            closeModal={() => {
              onClose();
            }}
          />
        )} */}
      </Modalize>
    </Block>
  );
};

export default Planning;
