import React from 'react';
import {StyleSheet} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {t2, t3, w2} from '../components/theme/fontsize';

export const styles = StyleSheet.create({
  modalView: {
    paddingVertical: t3,
    paddingHorizontal: w2,
    marginHorizontal: widthPercentageToDP(10),
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: widthPercentageToDP(70),
    alignSelf: 'center',
    marginTop: t2,
  },
  textStyle: {
    width: widthPercentageToDP(75),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalStyle: {margin: 0, paddingVertical: t2},
});
