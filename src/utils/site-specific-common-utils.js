import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';
import {images} from '../assets/index';
import {strictValidNumber} from './commonUtils';
import {config} from './config';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {Alert} from 'react-native';

export const cc_format = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  }
  return value;
};

export const getCardColor = (card) => {
  switch (card.toString().toLowerCase()) {
    case 'jcb':
      return images.jcb;
    case 'discover':
      return images.discover;
    case 'diners':
      return images.diner;
    case 'amex':
      return images.amex;
    case 'diners - carte blanche':
      return images.diner;
    case 'visa':
      return images.visa;
    case 'mastercard':
      return images.mastercard;
    default:
      return '';
  }
};

export const cc_expires_format = (string) => {
  return string
    .replace(
      /[^0-9]/g,
      '', // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      '0$1', // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      '0$1/$2', // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      '0', // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      '$1/$2', // To handle 113 > 11/3
    );
};

export const getCardType = (number) => {
  // visa
  let re = new RegExp('^4');
  if (number.match(re) != null) {
    return 'Visa';
  }

  // Mastercard
  // Updated for Mastercard 2017 BINs expansion
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number,
    )
  ) {
    return 'mastercard';
  }

  // AMEX
  re = new RegExp('^3[47]');
  if (number.match(re) != null) {
    return 'AMEX';
  }

  // Discover
  re = new RegExp(
    '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)',
  );
  if (number.match(re) != null) {
    return 'Discover';
  }

  // Diners
  re = new RegExp('^36');
  if (number.match(re) != null) {
    return 'Diners';
  }

  // Diners - Carte Blanche
  re = new RegExp('^30[0-5]');
  if (number.match(re) != null) {
    return 'Diners - Carte Blanche';
  }

  // JCB
  re = new RegExp('^35(2[89]|[3-8][0-9])');
  if (number.match(re) != null) {
    return 'JCB';
  }

  // Visa Electron
  re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
  if (number.match(re) != null) {
    return 'Visa Electron';
  }

  return '';
};

export const formatPrice = (price) => {
  if (!strictValidNumber(price)) {
    return 'Price is invalid number';
  }
  return price === 0 ? 'Free' : `$${price}`;
};
export const formatTime = (d) => {
  return moment(d).format('HH:mm');
};

export const uploadMedia = async (path, image) => {
  //   console.log(path, image, 'uploadMedia');
  //   const token = await AsyncStorage.getItem('token');
  //   const headers = {
  //     name: path,
  //   };
  //   var formData = new FormData();
  //   formData.append('image', JSON.stringify(image));
  //   return axios({
  //     method: 'post',
  //     url: `${config.Api_Url}/agent/upload-media`,
  //     headers,
  //     data: formData,
  //   });
  const uploadUrl = `${config.Api_Url}/agent/upload-media`;
  const headers = {
    name: path,
  };
  const formData = new FormData();
  formData.append('image', JSON.stringify(image));

  // return fetch(uploadUrl, {
  //   method: 'POST',
  //   headers: headers,
  //   body: formData,
  // })
  //   .then((response) => response)
  //   .catch((error) => error);
};

// export const uploadMedia = async (path, image) => {
//   const uploadUrl = `${config.Api_Url}/agent/upload-media`;

//   RNFS.uploadFiles({
//     toUrl: uploadUrl,
//     files: JSON.stringify(image),
//     method: 'POST',
//     headers: {
//       name: path,
//     },
//     fields: {
//       hello: 'world',
//     },
//     // begin: uploadBegin,
//     // progress: uploadProgress,
//   })
//     .promise.then((response) => {
//       console.log(response, 'response');
//       if (response.statusCode === 200) {
//         console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
//       } else {
//         console.log('SERVER ERROR');
//       }
//     })
//     .catch((err) => {
//       if (err.description === 'cancelled') {
//         // cancelled by user
//       }
//       console.log(err);
//     });
// };
export const UPLOAD = async (api, fileName, filePath, filetype, uploadType) => {
  const date = new Date();

  const tempPath =
    RNFS.DocumentDirectoryPath + '/' + date.getMilliseconds() + date.getHours();

  await RNFS.copyFile(filePath, tempPath);

  const fileExist = await RNFS.exists(tempPath);

  if (!fileExist) {
    Alert.alert('does not exist!');
    return false;
  }
  const _headers = {
    'Content-Type': 'multipart/form-data',
    name: uploadType,
  };
  let res = {};

  res = await RNFetchBlob.fetch(
    'POST',
    `${config.Api_Url}/agent/upload-media`,
    _headers,
    [
      {
        name: 'image',
        filename: fileName,
        type: filetype,
        data: RNFetchBlob.wrap(tempPath),
      },
    ],
  );
  console.log(res, 'res');
  return res;
};
