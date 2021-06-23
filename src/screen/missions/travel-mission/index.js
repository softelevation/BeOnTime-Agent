import React, {useState, useRef, useEffect} from 'react';
import {Block, Button, CustomButton, ImageComponent} from '../../../components';
import Header from '../../../components/common/header';
import AsyncStorage from '@react-native-community/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import {
  View,
  StyleSheet,
  Platform,
  Linking,
  AppState,
  Alert,
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

const googleKey = 'AIzaSyBf4G3qQTDy6-DN6Tb9m6WzgYCW598EoxU';

const TravelMission = ({
  route: {
    params: {item},
  },
}) => {
  const socket = io(config.Api_Url);
  const navigation = useNavigation();
  // User Params
  const {latitude, longitude} = item;
  // Initial State
  const [location, setlocation] = useState({
    latitude: 48.864716,
    longitude: 2.349014,
    latitudeDelta: 0.00922 * 1.5,
    longitudeDelta: 0.00421 * 1.5,
    angle: 120,
  });
  const mapRef = useRef();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {};

  const callSocket = async (position) => {
    console.log(position, 'position');
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

  useEffect(() => {
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
        distanceFilter: 100,
      },
    );
    return () => Geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      'Are you sure?',
      'you have arrived at your destination ?',
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
      <Header centerText="Travel To Mission" />
      <Block flex={1}>
        <MapView
          ref={mapRef}
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
          <Button
            disabled={item.status === 3}
            onPress={() => missionArrived()}
            textStyle={{textTransform: 'capitalize'}}
            style={{width: widthPercentageToDP(95)}}
            color="secondary">
            Arrived on the destination
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
});

export default TravelMission;
