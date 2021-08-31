/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useRef, useEffect} from 'react';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../../components';
import Header from '../../../components/common/header';
import AsyncStorage from '@react-native-community/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import {
  View,
  StyleSheet,
  Platform,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import {images} from '../../../assets';
import MapView, {
  AnimatedRegion,
  Marker,
  MarkerAnimated,
} from 'react-native-maps';
import {config} from '../../../utils/config';
import {io} from 'socket.io-client';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {t1, w3} from '../../../components/theme/fontsize';
import {strictValidNumber} from '../../../utils/commonUtils';
import BackgroundGeolocation from 'react-native-background-geolocation';

const googleKey = config.googleKey;

const TravelMissionScreen = ({
  route: {
    params: {item},
  },
}) => {
  const markerRef = useRef();
  const mapRef = useRef();

  const {width, height} = Dimensions.get('window');

  const loc = useSelector((state) => state.common.location.data);
  const navigation = useNavigation();
  const [distance, setDistance] = useState({
    distance: null,
    minutes: null,
  });
  const languageMode = useSelector((state) => state.languageReducer.language);
  const socket = io(config.Api_Url);
  const {
    TravelMission,
    ArrivedOnDestination,
    AreYouSure,
    HaveArrivedOnDestination,
    Yes,
    Cancel,
  } = languageMode;
  // User Params
  const {latitude, longitude} = item;
  // Initial State
  const [location, setlocation] = useState({
    latitude: loc.latitude || 0,
    longitude: loc.longitude || 0,
    latitudeDelta: 0.00922 * 1.5,
    longitudeDelta: 0.00421 * 1.5,
    angle: loc.heading || 40,
  });
  const [locationAni, setlocationAni] = useState(
    new AnimatedRegion({
      latitude: loc.latitude || 0,
      longitude: loc.longitude || 0,
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5,
      angle: loc.heading || 40,
    }),
  );
  console.log(location, 'location');

  useEffect(() => {
    BackgroundGeolocation.onLocation(onLocation, onError);

    // handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(onMotionChange);

    // event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(onActivityChange);

    // event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(onProviderChange);

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready(
      {
        foregroundService: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
        notification: {
          priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN,
        },
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        url: 'http://yourserver.com/locations',
        batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
        headers: {
          // <-- Optional HTTP headers
          'X-FOO': 'bar',
        },
        params: {
          // <-- Optional HTTP params
          auth_token: 'maybe_your_server_authenticates_via_token_YES?',
        },
      },
      (state) => {
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        );

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function () {
            console.log('- Start success');
          });
        }
      },
    );
    return () => {
      BackgroundGeolocation.removeListeners();
      BackgroundGeolocation.stopWatchPosition();
      BackgroundGeolocation.stopBackgroundTask();
      BackgroundGeolocation.stop();
      BackgroundGeolocation.stopSchedule();
    };
  }, []);

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS === 'android') {
      markerRef.current?.animateMarkerToCoordinate(newCoordinate, 7000);
    } else {
      locationAni.timing(newCoordinate).start();
    }
  };

  const onLocation = (loca) => {
    console.log('[location] -', loca);
  };
  const onError = (error) => {
    console.warn('[location] ERROR -', error);
  };
  const onActivityChange = (event) => {
    console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
  };
  const onProviderChange = (provider) => {
    console.log('[providerchange] -', provider.enabled, provider.status);
  };
  const onMotionChange = (event) => {
    console.log('[motionchange] -', event.isMoving, event.location);
  };

  const callSocket = async (position) => {
    const mission_id = item.id;
    const token = await AsyncStorage.getItem('token');
    const data = {
      token: token,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5,
      angle: position.coords.heading,
      speed: position.coords.speed,
      mission_id: mission_id,
    };
    socket.emit('agent_location', data);
  };
  const callSocketOnFirst = async (position) => {
    const mission_id = item.id;
    const token = await AsyncStorage.getItem('token');
    const data = {
      token: token,
      latitude: position.latitude,
      longitude: position.longitude,
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5,
      angle: position.angle,
      speed: position.speed || 10,
      mission_id: mission_id,
    };
    socket.emit('agent_location', data);
  };

  useFocusEffect(
    React.useCallback(() => {
      // let watchId = BackgroundGeolocation.getCurrentPosition(
      //   (position) => {
      //     let region = {
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //       latitudeDelta: 0.00922 * 1.5,
      //       longitudeDelta: 0.00421 * 1.5,
      //       angle: position.coords.heading,
      //     };

      //     setlocation(region);
      //     callSocket(position);
      //   },
      //   (error) => console.log(error),
      //   {
      //     enableHighAccuracy: true,
      //     timeout: 15000,
      //     maximumAge: 10000,
      //     distanceFilter: 1,
      //   },
      // );
      // BackgroundGeolocation.watchPosition({
      //   timeout: 30, // 30 second timeout to fetch location
      //   persist: true, // Defaults to state.enabled
      //   maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
      //   desiredAccuracy: 10, // Try to fetch a location with an accuracy of `10` meters.
      //   samples: 3, // How many location samples to attempt.
      //   extras: {
      //     // Custom meta-data.
      //     route_id: 123,
      //   },
      // }).then((position) => {
      //   let region = {
      //     latitude: position.coords.latitude,
      //     longitude: position.coords.longitude,
      //     latitudeDelta: 0.00922 * 1.5,
      //     longitudeDelta: 0.00421 * 1.5,
      //     angle: position.coords.heading,
      //   };
      //   setlocation(region);
      //   callSocket(position);
      // });
      // return () => {
      //   if (watchId !== null) {
      //     Geolocation.clearWatch(watchId);
      //   }
      // };

      BackgroundGeolocation.watchPosition(
        (position) => {
          console.log('[watchPosition] -', location);
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5,
            angle: position.coords.heading,
          };
          // animate(position.coords.latitude, position.coords.longitude);
          setlocationAni(new AnimatedRegion(region));
          setlocation(region);
          callSocket(position);
        },
        (errorCode) => {
          console.log('[watchPosition] ERROR -', errorCode);
        },
        {
          interval: 1000,
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          persist: true,
          extras: {foo: 'bar'},
          timeout: 15000,
        },
      );
    }, []),
  );

  useEffect(() => {
    callSocketOnFirst(location);
  }, []);

  const openMaps = (data) => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${data.latitude},${data.longitude}`;
    const label = `${data.first_name} ${data.last_name}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const deleteItem = async () => {
    const token = await AsyncStorage.getItem('token');
    const mission_id = item.id;
    BackgroundGeolocation.stopWatchPosition();
    BackgroundGeolocation.stopBackgroundTask();
    BackgroundGeolocation.stop();
    BackgroundGeolocation.stopSchedule();
    socket.emit('arrived_to_mission', {mission_id: mission_id, token: token});
    navigation.goBack();
  };

  const missionArrived = (id) => {
    Alert.alert(
      AreYouSure,
      HaveArrivedOnDestination,
      [
        {
          text: Cancel,
        },
        {
          text: Yes,
          onPress: () => deleteItem(),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <Block primary>
      <Header centerText={TravelMission} />

      <Block flex={1}>
        <MapView
          ref={mapRef}
          scrollEnabled
          style={styles.map}
          region={location}>
          <MarkerAnimated ref={markerRef} coordinate={locationAni}>
            <View>
              <ResponsiveImage
                style={{
                  transform: [{rotate: `${Math.ceil(location.angle) - 50}deg`}],
                }}
                source={images.currentlocation_icon}
                initHeight="60"
                initWidth="60"
              />
            </View>
          </MarkerAnimated>
          {location.latitude > 0 && (
            <MapViewDirections
              origin={location}
              destination={{
                latitude: JSON.parse(latitude),
                longitude: JSON.parse(longitude),
                latitudeDelta: 0.00922 * 1.5,
                longitudeDelta: 0.00421 * 1.5,
              }}
              apikey={googleKey}
              strokeWidth={3}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                setDistance({
                  ...distance,
                  distance: result.distance,
                  minutes: result.duration,
                });
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                    top: height / 20,
                  },
                });
              }}
            />
          )}

          <Marker
            tracksViewChanges={false}
            key={latitude}
            coordinate={{
              latitude: JSON.parse(latitude),
              longitude: JSON.parse(longitude),
              latitudeDelta: 0.00922 * 1.5,
              longitudeDelta: 0.00421 * 1.5,
            }}>
            <ImageComponent name={'user_map_icon'} height={40} width={40} />
          </Marker>
        </MapView>
        <CustomButton
          onPress={() => openMaps(item)}
          center
          middle
          style={styles.customMarker}
          flex={false}>
          <ImageComponent name="map_icon" height={30} width={30} />
        </CustomButton>
        <Block center middle style={styles.CustomButton} flex={false}>
          {strictValidNumber(distance.distance) && (
            <Block
              style={{width: widthPercentageToDP(95)}}
              color="#fff"
              center
              flex={false}
              padding={[t1, w3]}>
              <Text height={20} size={16}>
                Distance : {distance.distance.toFixed(2)} km left
              </Text>
              <Text size={16} height={20}>
                Duration : {distance.minutes.toFixed()} minutes left
              </Text>
            </Block>
          )}
          <Button
            disabled={item.status === 3}
            onPress={() => missionArrived()}
            textStyle={styles.textStyle}
            style={{width: widthPercentageToDP(95)}}
            color="secondary">
            {ArrivedOnDestination}
          </Button>
        </Block>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    position: 'absolute',
    top: heightPercentageToDP(1),
    right: widthPercentageToDP(3),
    height: 60,
    width: 60,
    borderRadius: 60,
    backgroundColor: '#fff',
  },
  CustomButton: {
    position: 'absolute',
    bottom: heightPercentageToDP(1),
    right: widthPercentageToDP(3),
  },
  textStyle: {textTransform: 'capitalize'},
});

export default TravelMissionScreen;
