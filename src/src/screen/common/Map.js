// import Geolocation from '@react-native-community/geolocation';
// import React, {useEffect, useRef, useState} from 'react';
// import {View, StyleSheet} from 'react-native';
// // import MapView, {Marker} from 'react-native-maps';
// import ResponsiveImage from 'react-native-responsive-image';
// import {images} from '../../assets';
// import {Block} from '../../components';

// const CommonMap = () => {
//   const [location, setlocation] = useState({
//     latitude: 0,
//     longitude: 0,
//     latitudeDelta: 0.00922 * 1.5,
//     longitudeDelta: 0.00421 * 1.5,
//   });
//   const mapRef = useRef();

//   const getDefaultCoords = () => {
//     return {
//       latitude: 48.864716,
//       longitude: 2.349014,
//       latitudeDelta: 0.00922 * 1.5,
//       longitudeDelta: 0.00421 * 1.5,
//     };
//   };
//   const isMapRegionSydney = (coords) => {
//     return (
//       coords.latitude >= 44.9333 &&
//       coords.latitude <= 48.9044 &&
//       coords.longitude >= 0.16 &&
//       coords.longitude <= 4.8917
//     );
//   };
//   useEffect(() => {
//     const watchId = Geolocation.getCurrentPosition(
//       (position) => {
//         let region = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           latitudeDelta: 0.00922 * 1.5,
//           longitudeDelta: 0.00421 * 1.5,
//           // angle: position.coords.heading,
//         };
//         console.log(position, 'position');

//         setlocation(region);
//       },
//       (error) => console.log("error==>>>",error),
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//       },
//     );

//     return () => Geolocation.clearWatch(watchId);
//   }, []);
//   return (
//     // <MapView
//     //   ref={mapRef}
//     //   style={{...StyleSheet.absoluteFillObject}}
//     //   region={location}
//     //   onRegionChangeComplete={async (coords) => {
//     //     if (!isMapRegionSydney(coords)) {
//     //       if (isMapRegionSydney(location)) {
//     //         mapRef && mapRef.current.animateToCoordinate(location);
//     //       } else {
//     //         setlocation(getDefaultCoords());
//     //         mapRef && mapRef.current.animateToCoordinate(getDefaultCoords());
//     //       }
//     //       return;
//     //     }
//     //   }}>
//     //   <Marker coordinate={location}>
//     //     <View>
//     //       <ResponsiveImage
//     //         style={{
//     //           transform: [{rotate: '120deg'}],
//     //         }}
//     //         source={images.currentlocation_icon}
//     //         initHeight="60"
//     //         initWidth="60"
//     //       />
//     //     </View>
//     //   </Marker>
//     // </MapView>
//     <Block />
//   );
// };

// export default CommonMap;

import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import ResponsiveImage from 'react-native-responsive-image';
import {images} from '../../assets';
import {Block} from '../../components';

const CommonMap = () => {
  const [location, setlocation] = useState({
    latitude: 48.864716,
    longitude: 2.349014,
    latitudeDelta: 0.00922 * 1.5,
    longitudeDelta: 0.00421 * 1.5,
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
  useEffect(() => {
    const watchId = Geolocation.getCurrentPosition(
      (position) => {
        let region = {
          // latitude: position.coords.latitude,
          // longitude: position.coords.longitude,
          // latitudeDelta: 0.00922 * 1.5,
          // longitudeDelta: 0.00421 * 1.5,
          // angle: position.coords.heading,
          latitude: 48.864716,
          longitude: 2.349014,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
        };
        setlocation(region);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);
  return (
    <View style={{flex: 1}}>
      <MapView
        ref={mapRef}
        style={{...StyleSheet.absoluteFillObject}}
        region={location}
        onRegionChangeComplete={async (coords) => {
          if (!isMapRegionSydney(coords)) {
            if (isMapRegionSydney(location)) {
              mapRef && mapRef.current.animateToCoordinate(location);
            } else {
              setlocation(getDefaultCoords());
              mapRef && mapRef.current.animateToCoordinate(getDefaultCoords());
            }
            return;
          }
        }}>
        <Marker coordinate={location}>
          <View>
            <ResponsiveImage
              style={{
                transform: [{rotate: '120deg'}],
              }}
              source={images.currentlocation_icon}
              initHeight="60"
              initWidth="60"
            />
          </View>
        </Marker>
      </MapView>

      <Block />
    </View>
  );
};

export default CommonMap;
