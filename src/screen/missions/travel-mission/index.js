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
import MapView, {Marker} from 'react-native-maps';
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

const googleKey = config.googleKey;

const TravelMissionScreen = ({
  route: {
    params: {item},
  },
}) => {
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

  const mapRef = useRef();
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
      let watchId = Geolocation.watchPosition(
        (position) => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5,
            angle: position.coords.heading,
          };

          setlocation(region);
          callSocket(position);
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 1,
        },
      );
      return () => {
        if (watchId !== null) {
          Geolocation.clearWatch(watchId);
        }
      };
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
    socket.emit('arrived_to_mission', {mission_id: mission_id, token: token});
    navigation.goBack();
  };

  const missionArrived = (id) => {
    Alert.alert(
      AreYouSure,
      HaveArrivedOnDestination,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
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
          followUserLocation
          scrollEnabled
          style={styles.map}
          region={location}
          onRegionChangeComplete={async (coords) => {
            mapRef.current?.animateCamera(coords);
          }}>
          <Marker coordinate={location}>
            <View>
              <ResponsiveImage
                style={{
                  transform: [{rotate: `${Math.ceil(location.angle) - 50}deg`}],
                }}
                name={
                  item.agent_type === 7
                    ? 'hostess_icon_selected'
                    : 'agent_icon_selected'
                }
                source={images.currentlocation_icon}
                initHeight="60"
                initWidth="60"
              />
            </View>
          </Marker>
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
