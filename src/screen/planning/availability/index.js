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

export class Available extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weeks: [],
      refreshing: false,
      AvailabilityData: [],
    };
  }

  onRefresh = () => {
    // const {providerId} = this.props;
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
    // this.props.getAvailabilityyRequest(providerId);
  };

  // componentDidMount() {
  //   this.focusListener = this.props.navigation.addListener('didFocus', () => {
  //     if (!this.props.AvailabilityData.length) {
  //       this.props.getAvailabilityyRequest(this.props.providerId);
  //     } else {
  //       this.setState({
  //         AvailabilityData: this.props.AvailabilityData,
  //       });
  //     }
  //   });
  // }

  componentWillUnmount() {
    // Remove the event listener
    // this.focusListener.remove();
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

  handleChange = (data) => {
    data.status = !data.status;
    this.setState((prevState) => ({
      AvailabilityData: prevState.AvailabilityData.map((resp) => {
        if (resp.id === data.id) {
          resp.status = data.status ? 1 : 0;
          return {...resp}; // force update
        } else {
          return resp;
        }
      }),
    }));
    this.props.statusAvailabilityRequest(data);
  };

  showDeleteAlert = (data) => {
    const id = data.id;
    Alert.alert(
      'Delete Availability',
      'Are you sure you want to delete the selected availability?',
      [
        {
          text: 'Yes',
          onPress: () => {
            this.props.deleteAvailabilityRequest(id);
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
    const AvailabilityData = [
      {
        id: '1',
        startDate: new Date(),
        endDate: new Date(),
        status: 1,
        days: ['mon', 'tue', 'wed'],
      },
      {
        id: '1',
        startDate: new Date(),
        endDate: new Date(),
        status: 0,
        days: ['mon', 'tue', 'thur'],
      },
      {
        id: '1',
        startDate: new Date(),
        endDate: new Date(),
        status: 0,
        days: ['mon', 'tue', 'sat'],
      },
      {
        id: '1',
        startDate: new Date(),
        endDate: new Date(),
        status: 1,
        days: ['mon', 'tue', 'fri', 'sun'],
      },
    ];
    return (
      <>
        <Block primary>
          <>
            {/* {(loader || statusLoader || setLoader) && <ActivityLoader />} */}
            <Header centerText={'Planning'} icon={'ios-menu'} />
            {AvailabilityData.length ? (
              <FlatList
                data={AvailabilityData}
                keyExtractor={(item) => item.id.toString()}
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
                  />
                )}
              />
            ) : (
              <Block center middle>
                <Text>{'No Availability'}</Text>
              </Block>
            )}
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
    const {item, onStatusChange, deleteAvailability} = this.props;
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
              NavigationService.navigate('AvailabilityAdd', {
                // daysData: item.days,
                // dateData: item,
                // id: item.id,
              })
            }>
            <View>
              <View style={styles.dateContainer}>
                <Text size={16}>
                  {'From'} : {this.formatDate(item.startDate)}
                </Text>
                <Text size={16}>
                  {' '}
                  {'To'} :{this.formatDate(item.endDate)}
                </Text>
              </View>
              <View style={styles.weekContainer}>
                {this.renderDays(item.days.indexOf('mon'), 'Mon')}
                {this.renderDays(item.days.indexOf('tue'), 'Tue')}
                {this.renderDays(item.days.indexOf('wed'), 'Wed')}
                {this.renderDays(item.days.indexOf('thur'), 'Thur')}
                {this.renderDays(item.days.indexOf('fri'), 'Fri')}
                {this.renderDays(item.days.indexOf('sat'), 'Sat')}
                {this.renderDays(item.days.indexOf('sun'), 'Sun')}
              </View>
            </View>
          </TouchableOpacity>
          <Block flex={false} right>
            {/* <ImageComponent name="close_arrow_icon" height={10} width={10} /> */}
            <Block center middle margin={[0, 0, 0, wp(2)]}>
              <Switch
                value={item.status === 0 ? false : true}
                onValueChange={() => onStatusChange(item)}
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
    providerId: state.loginReducer.user.id,
    language: state.languageReducer.language,
    AvailabilityData: state.setAvailabilityReducer.getAvailability,
    loader: state.setAvailabilityReducer.loading,
    statusLoader: state.setAvailabilityReducer.statusloading,
    setLoader: state.setAvailabilityReducer.setloading,
  };
};
export default connect(mapStateToProps, {})(Available);
