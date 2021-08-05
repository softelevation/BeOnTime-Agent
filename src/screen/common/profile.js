import React from 'react';
import {ImageBackground} from 'react-native';
import {ImageComponent} from '../../components';
import {strictValidString} from '../../utils/commonUtils';
import {config} from '../../utils/config';

const CustomAvatar = ({image}) => {
  return (
    <>
      {strictValidString(image) ? (
        <ImageBackground
          blurRadius={3}
          source={{uri: `${config.Api_Url}/${image}`}}
          style={style}
          imageStyle={imageStyle}
        />
      ) : (
        <ImageComponent name="blurAvatar_icon" height="50" width="50" />
      )}
    </>
  );
};
const style = {
  height: 50,
  width: 50,
};
const imageStyle = {
  borderRadius: 50,
};

export default CustomAvatar;
