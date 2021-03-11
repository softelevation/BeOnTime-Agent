import React, {useState, useRef, useEffect} from 'react';
import {
  StackActions,
  useNavigation,
  NavigationAction,
} from '@react-navigation/native';
import {
  Block,
  Button,
  ImageComponent,
  Text,
  CustomButton,
} from '../../components';
import Header from '../../components/common/header';
import {Modalize} from 'react-native-modalize';
import {t1, t2, w3, t5} from '../../components/theme/fontsize';
import {AgentType, MissionType, PaymentStatus} from '../../utils/data';
import Rating from '../../components/ratings';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {divider} from '../../utils/commonView';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import CommonApi from '../../utils/CommonApi';
import {FlatList, ScrollView, View} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

const MissionReport = ({}) => {
  const [toggle, setToggle] = useState(true);
  const [addSignature, setAddSignature] = useState(false);
  const ref = useRef();
  const navigation = useNavigation();

  const onDrawSignature = async () => {
    setAddSignature(true);
  };

  const handleSignature = (signature) => {
    console.log('signature==>>>', signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    console.log('clear success!');
  };

  const handleEnd = () => {
    ref.current.readSignature();
  };

  const renderType = (label, description, onPress, value) => {
    return (
      <CustomButton
        onPress={onPress}
        margin={[t1, t1]}
        borderWidth={1}
        borderColor={'#F5F7FA'}
        flex={false}
        space={'between'}
        padding={[t1]}
        center
        row>
        <Block flex={false}>
          <Text color="#8A8E99" caption>
            {label}
          </Text>
          <Text bold color="#8A8E99" margin={[t1, 0, 0, 0]} size={16}>
            {value || description}
          </Text>
        </Block>
        <ImageComponent name="down_arrow_icon" height="8" width="14" />
      </CustomButton>
    );
  };

  return (
    <Block white>
      <Block padding={[w3, w3, w3, w3]} margin={[w3, w3, w3, w3]} row center>
        <ImageComponent name="close_arrow_icon" height="20" width="20" />
        <Block margin={[20, 0, 0, 0]} center flex={false}>
          <Text semibold size={18} align={'center'}>
            Mission Report
          </Text>
          <Text margin={[hp(0.5), 0, 0]} size={16} grey />
        </Block>
      </Block>

      <ScrollView>
        <View style={{margin: 16}}>
          <Text align={'center'} size={16}>
            Completed missions
          </Text>
        </View>
        <Block
          flex={false}
          column
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}>
          <Text size={16}>Completed missions</Text>
          <Text grey size={16}>
            dummy text
          </Text>
        </Block>

        {renderType(
          'Mission type',
          'Gaurd service',
          () => console.log('Mission'),
          '',
        )}

        {renderType('Date', '2020-10-15', () => console.log('Date'), '')}

        {renderType('Heure appel', '12:00', () => console.log('Date'), '')}

        {renderType('Heure arivve', '13:00', () => console.log('Date'), '')}

        {renderType('Heure de depart', '14:00', () => console.log('Date'), '')}

        {renderType(
          'Constat meteo',
          'Vent fort',
          () => console.log('Date'),
          '',
        )}

        {renderType(
          'Circulation',
          'Mauvaise (motif)',
          () => console.log('Date'),
          '',
        )}

        {renderType(
          'Circuit de Verification',
          'Interieur',
          () => console.log('Date'),
          '',
        )}

        {renderType('Lumiere allume', 'Non', () => console.log('Date'), '')}

        {renderType('Issues(s) ouvertes', 'Non', () => console.log('Date'), '')}

        {renderType('Sirene en fonction', 'Non', () => console.log('Date'), '')}

        {renderType(
          'Circuit de Verification',
          'Interieur',
          () => console.log('Date'),
          '',
        )}

        {renderType('Systeme', 'En service', () => console.log('Date'), '')}

        {renderType(
          'Remise en service du systeme',
          'Oui',
          () => console.log('Date'),
          '',
        )}

        {renderType(
          'Effraction constatee',
          'Oui',
          () => console.log('Date'),
          '',
        )}

        <View style={{padding: 16}}>
          <Text color="black" size={20}>
            Signature
          </Text>
          {addSignature ? (
            <View style={{height: 300}}>
              <SignatureScreen
                ref={ref}
                onEnd={handleEnd}
                onOK={handleSignature}
                onEmpty={handleEmpty}
                onClear={handleClear}
              />
            </View>
          ) : null}

          <Button onPress={() => onDrawSignature()} color="primary">
            Draw signature
          </Button>
        </View>
      </ScrollView>
    </Block>
  );
};

export default MissionReport;
