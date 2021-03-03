import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Block, ImageComponent} from '../';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {Text} from '../';
const Header = ({onPress, centerText, rightText, leftIcon}) => {
  const nav = useNavigation();
  return (
    <>
      <Block safearea flex={false} primary />
      <Block
        borderWidth={[0, 0, 1, 0]}
        borderColorDeafult
        center
        row
        primary
        space={'between'}
        padding={[hp(2), wp(3)]}
        flex={false}>
        {!leftIcon ? (
          <TouchableOpacity onPress={() => onPress || nav.goBack()}>
            <ImageComponent name="back_arrow_icon" height={18} width={18} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onPress || nav.goBack()}>
            <Text style={{height: 18, width: 18}} />
          </TouchableOpacity>
        )}
        <Text semibold>{centerText}</Text>
        <TouchableOpacity>
          <Text>{rightText}</Text>
        </TouchableOpacity>
      </Block>
    </>
  );
};

Header.defaultProps = {
  centerText: '',
  rightText: '',
};
Header.propTypes = {
  centerText: PropTypes.string,
  rightText: PropTypes.string,
  leftIcon: PropTypes.string,
  onPress: PropTypes.func,
};
export default Header;
