import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import HeaderTab from '../../../components/common/header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {
  Button,
  Checkbox,
  ImageComponent,
  Text,
  Block,
} from '../../../components';
import {light} from '../../../components/theme/colors';
import {connect} from 'react-redux';
import {addPlanningRequest} from '../../../redux/planning/action';
import {
  strictValidObject,
  strictValidObjectWithKeys,
} from '../../../utils/commonUtils';
class Availabilityplus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: '',
      toDate: '',
      weekDays: {
        mon: {
          startTime: '',
          endTime: '',
        },
        tue: {
          startTime: '',
          endTime: '',
        },
        wed: {
          startTime: '',
          endTime: '',
        },
        thu: {
          startTime: '',
          endTime: '',
        },
        fri: {
          startTime: '',
          endTime: '',
        },
        sat: {
          startTime: '',
          endTime: '',
        },
        sun: {
          startTime: '',
          endTime: '',
        },
      },
      isOpen: {},
      isOpenDate: false,
      toOpenDate: false,
      options: {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      },
      DateError: '',
      TimeError: '',
      unselectChkError: '',
      timeTapped: false,
    };
  }
  componentDidMount() {
    const dateData =
      this.props.route.params && this.props.route.params.dateData
        ? this.props.route.params.dateData
        : '';
    if (dateData) {
      console.log(dateData, 'dateData');
      this.fetchData(dateData);
    }
  }
  fetchData = async (dateData) => {
    const totalDays = dateData && dateData.schedule_time;
    this.setState({
      fromDate: this.formatEditedDate(dateData.start_date),
      toDate: this.formatEditedDate(dateData.end_date),
    });
    (await totalDays) &&
      totalDays.forEach((item) => {
        this.setState({
          weekDays: {
            ...this.state.weekDays,
            [item.schedule_day]: {
              startTime: this.formatEditedTime(
                item.available_from,
                item.start_date,
              ),
              endTime: this.formatEditedTime(item.available_to, item.end_date),
            },
          },
          options: {
            ...this.state.options,
            [item.schedule_day]: true,
          },
        });
      });
  };
  formatEditedTime = (time, d) => {
    let date = new Date(d);
    let timeArray = time.split(':');
    console.log(timeArray, 'yfuyfvuvuyvyuschedule_day');
    date.setHours(timeArray[0]);
    date.setMinutes(timeArray[1]);
    date.setSeconds(timeArray[2]);
    return date;
  };
  formatEditedDate = (date) => {
    return new Date(date);
  };
  OptionChange = (param) => {
    if (Object.prototype.hasOwnProperty.call(this.state.options, param)) {
      var element = this.state.options[param];
      let distanceTime = 1;
      let distanceHour = 0;
      if (
        this.state.weekDays[param].startTime !== '' &&
        this.state.weekDays[param].endTime !== ''
      ) {
        distanceTime =
          this.state.weekDays[param].startTime.getMinutes() -
          this.state.weekDays[param].endTime.getMinutes();
        distanceHour =
          this.state.weekDays[param].startTime.getHours() -
          this.state.weekDays[param].endTime.getHours();
      }
      this.setState({
        options: {
          ...this.state.options,
          [param]:
            distanceTime === 0 && (distanceHour > 0 || distanceHour < 0)
              ? !element
              : false,
        },
      });
    } else {
      this.setState({
        options: {
          ...this.state.options,
          [param]: true,
        },
      });
    }
  };
  timePicker = (value) => {
    const {timeTapped} = this.state;
    !timeTapped &&
      this.setState({
        timeTapped: true,
        isOpen: {[value]: true},
      });

    timeTapped && setTimeout(() => this.setState({timeTapped: false}), 1000);
  };
  formatTime = (date) => {
    return moment(date).format('HH:mm');
  };
  onConfirmTimePicker = (date, day, selectedType, index) => {
    const weekDays = {
      ...this.state.weekDays,
      [day]: {
        ...this.state.weekDays[day],
        [selectedType]: date,
      },
    };

    let distanceTime = 1;
    let distanceHour = 0;

    const {timeTapped} = this.state;
    let isOpen = {};

    if (selectedType === 'startTime') {
      isOpen[day] = false;
      isOpen[day + '-end'] = timeTapped;
    } else if (selectedType === 'endTime') {
      isOpen[day] = timeTapped;
      isOpen[day + '-end'] = false;
    }
    this.setState({
      timeTapped: false,
      isOpen,
      TimeError: '',
      weekDays,
      options: {
        ...this.state.options,
        [day]:
          weekDays[day].startTime !== '' &&
          weekDays[day].endTime !== '' &&
          distanceTime === 0 &&
          distanceHour > 0
            ? true
            : false,
      },
    });
    if (weekDays[day].startTime !== '' && weekDays[day].endTime !== '') {
      if (
        weekDays[day].startTime.getHours() > weekDays[day].endTime.getHours()
      ) {
        this.hideDateTimePicker(day + '-end');
        return this.setState({TimeError: 'Invalid Time'});
      }

      distanceTime =
        weekDays[day].startTime.getMinutes() -
        weekDays[day].endTime.getMinutes();
      distanceHour =
        weekDays[day].startTime.getHours() - weekDays[day].endTime.getHours();
      if (distanceHour === 0 || distanceTime !== 0 || distanceTime < 0) {
        this.hideDateTimePicker(day + '-end');
        return this.setState({TimeError: 'Invalid Time'});
      }
    }
    this.hideDateTimePicker(day + '-end');
  };
  onCancelTimePicker = (value) => {
    this.setState({isOpen: {[value]: false}});
  };
  hideDateTimePicker = (Day) => {
    this.setState({
      isOpen: {[Day]: false},
      isOpenDate: false,
      toOpenDate: false,
    });
  };
  handleDatePicked = (date) => {
    this.setState({fromDate: date});
    this.hideDateTimePicker();
  };
  handleDatetoPicked = (date) => {
    this.setState({toDate: date});
    this.hideDateTimePicker();
  };
  changeShowDateFormat = (date) => {
    const monthArray = [
      'Jan',
      'Feb',
      'March',
      'April',
      'May',
      'June',
      'July',
      'Au',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    const selected2 =
      date.getDate() +
      '/' +
      monthArray[date.getMonth()] +
      '/' +
      date.getFullYear();
    return selected2;
  };
  showDateTimePicker = () => {
    this.setState({
      isOpenDate: true,
    });
  };
  showDateToPicker = () => {
    this.setState({
      toOpenDate: true,
    });
  };
  showtoDatePicker = () => {
    this.setState({toOpenDate: true});
  };
  renderTimeSelector = (
    Day,
    startTime,
    endTime,
    index,
    options,
    optionValue,
    weekDaysName,
  ) => {
    return (
      <View key={index} style={styles.timeContainer}>
        <Text uppercase semibold size={14} style={{width: wp(15)}}>
          {weekDaysName}
        </Text>
        <Checkbox
          checked={options}
          onChange={() => this.OptionChange(optionValue)}
          label=""
          checkboxStyle={styles.checkboxStyle}
        />
        <View style={styles.timeSelector}>
          <ImageComponent
            name="clock_icon"
            height={15}
            width={15}
            color="#4C4C4C"
          />
          <TouchableOpacity onPress={() => this.timePicker(Day)} key={index}>
            <Text style={styles.timeSelectorText}>
              {this.state.weekDays[Day] && this.state.weekDays[Day][startTime]
                ? this.formatTime(this.state.weekDays[Day][startTime])
                : 'HH:mm'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.timeSelector]}>
          <ImageComponent
            name="clock_icon"
            height={15}
            width={15}
            color="#4C4C4C"
          />
          <TouchableOpacity
            onPress={() => this.timePicker(Day + '-end')}
            key={index}>
            <Text style={styles.timeSelectorText}>
              {this.state.weekDays[Day] && this.state.weekDays[Day][endTime]
                ? this.formatTime(this.state.weekDays[Day][endTime])
                : 'HH:mm'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          mode="time"
          // date={new Date()}
          isVisible={this.state.isOpen[Day]}
          onConfirm={(e) => this.onConfirmTimePicker(e, Day, startTime, index)}
          onCancel={() => this.onCancelTimePicker(Day)}
          titleIOS={'Picker Start Time'}
          key={index + 1}
        />

        <DateTimePicker
          mode="time"
          // date={new Date()}
          isVisible={this.state.isOpen[Day + '-end']}
          onConfirm={(e) => this.onConfirmTimePicker(e, Day, endTime, index)}
          onCancel={() => this.onCancelTimePicker(Day)}
          titleIOS={'Picker End Time'}
          key={index}
        />
      </View>
    );
  };
  formatDateApi = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };
  formatDateAvailability = (date) => {
    return moment(date).format('DD/MMM/YYYY');
  };
  formatTimeApi = (time) => {
    return moment(time).format('HH:mm:ss');
  };
  SaveData = async () => {
    // this.props.navigation.goBack();
    const {options, fromDate, toDate} = this.state;
    const startDate = this.formatDateApi(fromDate);
    const endDate = this.formatDateApi(toDate);
    const id =
      this.props.route.params && this.props.route.params.id
        ? this.props.route.params.id
        : 0;
    var passingData = this.state.weekDays;
    const data = [];
    Object.keys(options).forEach((key) => {
      if (options[key] === true) {
        let obj = {};
        obj.day = key;
        obj.startTime = this.formatTimeApi(passingData[key].startTime);
        obj.endTime = this.formatTimeApi(passingData[key].endTime);
        data.push(obj);
      }
    });
    console.log(startDate, endDate, data, 'start');
    if (!toDate) {
      this.setState({
        DateError: 'Invalid Date Time',
      });
    }
    if (!fromDate) {
      this.setState({
        DateError: 'Invalid Date Time',
      });
    } else if (fromDate !== '' && toDate !== '' && data.length > 0) {
      this.setState({DateError: ''});
      const sendingData = {
        startDate: startDate,
        endDate: endDate,
        data: data,
        id: id,
      };
      this.props.addPlanningRequest(sendingData);
    }
  };
  render() {
    const {options, toDate, startDate} = this.state;
    console.log(this.state, 'this.state');
    const {loading} = this.props;
    console.log(this.props);
    return (
      <>
        <Block safearea primary>
          <HeaderTab centerText={'New Planning'} />
          <ScrollView>
            <View style={styles.container}>
              <Text semibold style={styles.dateRangeText}>
                {'Date Range'}
              </Text>
              <View style={styles.RangeSelector}>
                <View>
                  <Text style={styles.FromToText}>{'From'}</Text>
                  <View style={styles.DateSelector}>
                    <ImageComponent
                      name="calendar_icon"
                      height={15}
                      width={15}
                      color="#4C4C4C"
                    />
                    <Text
                      onPress={() => this.showDateTimePicker()}
                      style={styles.SelectDateText}>
                      {this.state.fromDate
                        ? this.changeShowDateFormat(this.state.fromDate)
                        : 'DD/MM/YYYY'}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.FromToText}>{'To'}</Text>
                  <View style={styles.DateSelector}>
                    <ImageComponent
                      name="calendar_icon"
                      height={15}
                      width={15}
                      color="#4C4C4C"
                    />
                    <Text
                      style={styles.SelectDateText}
                      onPress={() => this.showDateToPicker()}>
                      {this.state.toDate
                        ? this.changeShowDateFormat(this.state.toDate)
                        : 'DD/MM/YYYY'}
                    </Text>
                  </View>
                </View>
                <DateTimePicker
                  mode="date"
                  isVisible={this.state.isOpenDate}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  titleIOS={'From Date'}
                />
                <DateTimePicker
                  mode="date"
                  isVisible={this.state.toOpenDate}
                  onConfirm={this.handleDatetoPicked}
                  onCancel={this.hideDateTimePicker}
                  titleIOS={'To Date'}
                />
              </View>

              {(toDate === '' || startDate === '') && (
                <Text style={styles.errorStyle}>{this.state.DateError}</Text>
              )}
              <View style={styles.secondContainer}>
                <Text
                  semibold
                  style={[styles.dateRangeText, {marginVertical: hp(1)}]}>
                  {'Hourly Interval'}
                </Text>
                {this.state.TimeError !== '' && (
                  <Text style={styles.errorStyle}>
                    {this.state.TimeError ? this.state.TimeError : ''}
                  </Text>
                )}
                {this.state.unselectChkError !== '' && (
                  <Text style={styles.errorStyle}>
                    {this.state.unselectChkError
                      ? this.state.unselectChkError
                      : ''}
                  </Text>
                )}
                {this.renderTimeSelector(
                  'mon',
                  'startTime',
                  'endTime',
                  1,
                  options.mon,
                  'mon',
                  'Mon',
                )}
                {this.renderTimeSelector(
                  'tue',
                  'startTime',
                  'endTime',
                  2,
                  options.tue,
                  'tue',
                  'Tue',
                )}
                {this.renderTimeSelector(
                  'wed',
                  'startTime',
                  'endTime',
                  3,
                  options.wed,
                  'wed',
                  'Wed',
                )}
                {this.renderTimeSelector(
                  'thu',
                  'startTime',
                  'endTime',
                  4,
                  options.thu,
                  'thu',
                  'Thur',
                )}
                {this.renderTimeSelector(
                  'fri',
                  'startTime',
                  'endTime',
                  5,
                  options.fri,
                  'fri',
                  'Fri',
                )}
                {this.renderTimeSelector(
                  'sat',
                  'startTime',
                  'endTime',
                  6,
                  options.sat,
                  'sat',
                  'Sat',
                )}
                {this.renderTimeSelector(
                  'sun',
                  'startTime',
                  'endTime',
                  7,
                  options.sun,
                  'sun',
                  'Sun',
                )}
              </View>
            </View>
          </ScrollView>
        </Block>
        <View style={styles.plusContainer}>
          <Button
            isLoading={loading}
            style={{width: wp(90)}}
            onPress={() => this.SaveData()}
            color="secondary">
            Save Planning
          </Button>
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: wp(90),
    alignSelf: 'center',
  },
  FromToText: {
    // color: '#00000061',
    color: light.subtitleColor,
    fontSize: 14,
    // fontFamily: FontFamily.fontFamilyRegular,
    marginBottom: hp(2),
  },
  dateRangeText: {
    fontSize: 18,
    // fontFamily: FontFamily.fontFamilyRegular,
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  RangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  DateSelector: {
    borderBottomWidth: 1,
    borderBottomColor: '1px solid rgba(0, 0, 0, .4 )',
    width: wp(40),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp(0.5),
  },
  SelectDateText: {
    marginLeft: wp(3),
    color: '#757575',
    // fontFamily: FontFamily.fontFamilyRegular,
    fontSize: 16,
  },
  secondContainer: {
    marginTop: hp(1),
  },
  timeSelector: {
    borderBottomWidth: 1,
    borderBottomColor: '1px solid rgba(0, 0, 0, .4 )',
    width: wp(22),
    flexDirection: 'row',
    paddingBottom: hp(0.5),
  },
  timeSelectorText: {
    marginLeft: wp(2),
    width: wp(17),
    fontSize: 12,
  },
  errorStyle: {
    width: wp(90),
    fontSize: 9,
    // fontFamily: FontFamily.fontFamilyRegular,
    color: '#B92D00',
    textAlign: 'center',
    marginTop: hp(1),
  },
  plusContainer: {
    alignSelf: 'center',
    bottom: hp(2),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp(1),
  },
  checkboxStyle: {height: 30, width: 30},
});
const mapStateToProps = (state) => {
  return {
    loading: state.planning.savePlanning.loading,
  };
};
export default connect(mapStateToProps, {addPlanningRequest})(Availabilityplus);
