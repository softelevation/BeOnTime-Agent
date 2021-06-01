import React, {useState, useRef, useEffect} from 'react';
import {Block, Button, ImageComponent} from '../../../components';
import Header from '../../../components/common/header';
import CommonMap from '../../common/Map';
import {Modalize} from 'react-native-modalize';
import {t1, t2, w3} from '../../../components/theme/fontsize';
import {AgentType, MissionType} from '../../../utils/data';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {divider} from '../../../utils/commonView';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {
  format,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/commonUtils';
import AsyncStorage from '@react-native-community/async-storage';
import {getMissionsRequest, missionListRequest} from '../../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {StackActions, useNavigation} from '@react-navigation/core';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import {Alert, View, StyleSheet} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import {images} from '../../../assets';
import MapView, {Marker} from 'react-native-maps';

const googleKey = 'AIzaSyBf4G3qQTDy6-DN6Tb9m6WzgYCW598EoxU';

const TravelMission = ({
  route: {
    params: {item},
  },
}) => {
  const modalizeRef = useRef(null);
  const dispatch = useDispatch();

  // Reducers

  const socket = useSelector((state) => state.socket.data);
  const [location, setlocation] = useState({
    latitude: 48.864716,
    longitude: 2.349014,
    latitudeDelta: 0.00922 * 1.5,
    longitudeDelta: 0.00421 * 1.5,
    angle: 120,
  });
  const mapRef = useRef();

  const getDefaultCoords = () => {
    return {
      latitude: 48.864716,
      longitude: 2.349014,
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5,
    };
  };
  const isMapRegionSydney = (coords) => {
    return (
      coords.latitude >= 44.9333 &&
      coords.latitude <= 48.9044 &&
      coords.longitude >= 0.16 &&
      coords.longitude <= 4.8917
    );
  };
  const callSocket = async (position) => {
    console.log(position);
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
    console.log(data);

    socket.emit('agent_location', data);
    console.log(data);
  };

  useEffect(() => {
    let watchId = Geolocation.watchPosition(
      (position) => {
        console.log(position);
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
        distanceFilter: 2000,
      },
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  const {
    id,
    first_name,
    last_name,
    title,
    agent_type,
    description,
    vehicle_required,
    total_hours,
    status,
    intervention,
    mission_finish_time,
    time_intervel,
    repetitive_mission,
    latitude,
    longitude,
  } = item;
  // console.log(item, 'item');

  return (
    <Block primary>
      <Header centerText="Travel To Mission" />
      <Block flex={1}>
        <MapView
          ref={mapRef}
          scrollEnabled
          // provider="google"
          style={styles.map}
          // showsUserLocation={true}
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
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.00922 * 1.5,
                longitudeDelta: 0.00421 * 1.5,
              }}
              apikey={googleKey}
              strokeWidth={3}
            />
          )}

          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.00922 * 1.5,
              longitudeDelta: 0.00421 * 1.5,
            }}>
            <ImageComponent
              name={
                item.agent_type === 7
                  ? 'hostess_icon_selected'
                  : 'agent_icon_selected'
              }
              height="60"
              width="60"
            />
          </Marker>
        </MapView>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default TravelMission;
