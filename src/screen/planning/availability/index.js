import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  RefreshControl,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import moment from 'moment';
import ActivityLoader from '../../../components/activityLoader';
import * as NavigationService from '../../../routes/NavigationService';
import Header from '../../../components/common/header';
import {ImageComponent, Text, Block} from '../../../components';
import {Switch} from '../../../components/switch';
import {light} from '../../../components/theme/colors';
import {getPlanningRequest} from '../../../redux/planning/action';
import {Alerts, strictValidArrayWithLength} from '../../../utils/commonUtils';
import EmptyFile from '../../../components/emptyFile';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../../../utils/config';

class Available extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weeks: [],
      refreshing: false,
      AvailabilityData: [],
      loading: false,
    };
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
    this.props.getPlanningRequest();
  };

  componentDidMount() {
    console.log(this.props);
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.props.getPlanningRequest();
    });
  }

  // componentDidUpdate(prevProps) {
  //   if (
  //     this.props.AvailabilityData &&
  //     prevProps.AvailabilityData !== this.props.AvailabilityData
  //   ) {
  //     this.setState({
  //       AvailabilityData: this.props.AvailabilityData,
  //     });
  //   }
  // }

  handleChange = async (id, state, action) => {
    const status = state === 1 ? 0 : 1;
    this.setState({
      loading: true,
    });
    const token = await AsyncStorage.getItem('token');
    const language = await AsyncStorage.getItem('language');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
      language: language,
    };
    const res = await axios({
      method: 'post',
      url: `${config.Api_Url}/agent/agent-schedule-status`,
      headers,
      data: {
        status: status,
        id: id,
        action: action,
      },
    });
    if (res) {
      this.setState({
        loading: true,
      });
      Alerts(res.data.message);
      this.props.getPlanningRequest();
    }
  };

  showDeleteAlert = (data) => {
    Alert.alert(
      'Delete Planning',
      'Are you sure you want to delete the selected Planning?',
      [
        {
          text: 'Yes',
          onPress: () => {
            this.handleChange(data.id, 1, 'delete');
          },
        },
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
      ],
    );
  };

  render() {
    const {Planning, NoPlanningAvailable} = this.props.languageMode;
    return (
      <>
        <Block primary>
          {!this.state.refreshing &&
            !this.state.loading &&
            this.props.loader && <ActivityLoader />}
          <>
            {/* {(loader || statusLoader || setLoader) && <ActivityLoader />} */}
            <Header centerText={Planning} icon={'ios-menu'} />
            {/* {strictValidArrayWithLength(this.props.data) ? ( */}
            <FlatList
              data={this.props.data}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{flexGrow: 1}}
              ListEmptyComponent={<EmptyFile text={NoPlanningAvailable} />}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              renderItem={({item}) => (
                <AvailabilityListITem
                  item={item}
                  onStatusChange={this.handleChange}
                  deleteAvailability={this.showDeleteAlert}
                  navigation={this.props.navigation}
                  language={this.props.languageMode}
                />
              )}
            />
            {/* ) : (
              <Block center middle>
                <Text>{'No Planning Available'}</Text>
              </Block>
            )} */}
          </>
        </Block>
        <View style={styles.plusContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Availabilityplus')}>
            <ImageComponent name="plus_icon" height={60} width={70} />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

class AvailabilityListITem extends React.PureComponent {
  formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  renderDays = (item, name) => {
    return (
      <Text
        size={16}
        capitalize
        semibold={item !== -1}
        color={item !== -1 ? light.secondary : light.subtitleColor}>
        {name}
      </Text>
    );
  };

  render() {
    const {
      item,
      onStatusChange,
      deleteAvailability,
      navigation,
      language,
    } = this.props;
    const perWeekDays = [];
    const {From, To, Mon, Tue, Wed, Thur, Fri, Sat, Sun} = language;
    return (
      <>
        <Block
          flex={false}
          opacity={
            item.status === 0 ? (Platform.OS === 'android' ? 0.9 : 0.5) : 1
          }
          style={[styles.mainContainer]}>
          <TouchableOpacity
            onLongPress={() => deleteAvailability(item)}
            onPress={() =>
              navigation?.navigate('Availabilityplus', {
                daysData: item.schedule_time,
                dateData: item,
                id: item.id,
              })
            }>
            <View>
              <View style={styles.dateContainer}>
                <Text size={16}>
                  {From} : {this.formatDate(item.start_date)}
                </Text>
                <Text size={16}>
                  {' '}
                  {To} :{this.formatDate(item.end_date)}
                </Text>
              </View>
              {item.schedule_time.forEach((r) => {
                perWeekDays.push(r.schedule_day);
              })}

              <View style={styles.weekContainer}>
                {this.renderDays(perWeekDays.indexOf('mon'), Mon)}
                {this.renderDays(perWeekDays.indexOf('tue'), Tue)}
                {this.renderDays(perWeekDays.indexOf('wed'), Wed)}
                {this.renderDays(perWeekDays.indexOf('thu'), Thur)}
                {this.renderDays(perWeekDays.indexOf('fri'), Fri)}
                {this.renderDays(perWeekDays.indexOf('sat'), Sat)}
                {this.renderDays(perWeekDays.indexOf('sun'), Sun)}
              </View>
            </View>
          </TouchableOpacity>
          <Block flex={false} right>
            {/* <ImageComponent name="close_arrow_icon" height={10} width={10} /> */}
            <Block center middle margin={[0, 0, 0, wp(2)]}>
              <Switch
                value={item.status === 0 ? false : true}
                onValueChange={() =>
                  onStatusChange(item.id, item.status, 'update')
                }
                circleSize={24}
                barHeight={20}
                circleBorderWidth={2}
                backgroundActive={'#000'}
                backgroundInactive={light.subtitleColor}
                circleActiveColor={'#ffffff'}
                circleInActiveColor={'#ffffff'}
                changeValueImmediately={true}
                renderActiveText={false}
                renderInActiveText={false}
              />
            </Block>
          </Block>
        </Block>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: wp(90),
    alignSelf: 'center',
    marginVertical: hp(1),
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(2),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
    flexDirection: 'row',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(71),
    paddingHorizontal: Platform.OS === 'ios' ? wp(3) : wp(4),
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(71),
    paddingHorizontal: Platform.OS === 'ios' ? wp(3) : wp(4),
    paddingTop: hp(1.5),
  },
  plusContainer: {
    position: 'absolute',
    right: wp(3),
    bottom: hp(2),
    shadowColor: '#0000003D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 1.8,
    elevation: 9,
  },
});
const mapStateToProps = (state) => {
  return {
    loader: state.planning.getPlanning.loading,
    data: state.planning.getPlanning.data,
    languageMode: state.languageReducer.language,
  };
};
export default connect(mapStateToProps, {getPlanningRequest})(Available);
