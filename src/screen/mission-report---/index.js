import React, {useState, useRef, useEffect} from 'react';
import {
  StackActions,
  useNavigation,
  NavigationAction,
} from '@react-navigation/native';
import {Block, Button, ImageComponent, Text} from '../../components';
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
import {FlatList, ScrollView} from 'react-native';

const MissionReport = ({
  route: {
    params: {item},
  },
}) => {
  const [toggle, setToggle] = useState(true);

  const {
    id,
    username,
    title,
    location,
    latitude,
    longitude,
    agent_type,
    description,
    vehicle_required,
    total_hours,
    amount,
    payment_status,
    status,
    intervention,
    start_date_time,
  } = item;

  const ref = useRef();
  const navigation = useNavigation();
  // const profile = useSelector((state) => state.user.profile.user.data);
  const [profile, setProfileData] = useState({});

  const onDrawSignature = async () => {};

  useEffect(() => {
    CommonApi.fetchAppCommon('/profile', 'GET', '')
      .then((response) => {
        if (response.status == 1) {
          setProfileData(response.data);
        }
      })
      .catch((err) => {
        console.log('error profile===>>', err);
      });
  }, []);

  // const renderType = (label, description, onPress, value) => {
  //   return (
  //     <CustomButton
  //       onPress={onPress}
  //       margin={[t1, 0]}
  //       borderWidth={1}
  //       borderColor={'#F5F7FA'}
  //       flex={false}
  //       space={'between'}
  //       padding={[t1]}
  //       center
  //       row>
  //       <Block flex={false}>
  //         <Text color="#8A8E99" caption>
  //           {label}
  //         </Text>
  //         <Text bold color="#8A8E99" margin={[t1, 0, 0, 0]} size={16}>
  //           {value || description}
  //         </Text>
  //       </Block>
  //       <ImageComponent name="down_arrow_icon" height="8" width="14" />
  //     </CustomButton>
  //   );
  // };

  return (
    <Block white>
      <Header leftIcon={true} menu centerText={'Profile'} />
      <ScrollView>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Address</Text>
          <Text grey size={16}>
            {profile.home_address}
          </Text>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Completed missions</Text>
          <Text grey size={16} />
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          margin={[t1, 0]}
          padding={[0, w3]}
          center>
          <Text size={16}>Hours clocked</Text>
          <Text grey size={16} />
        </Block>

        {/* {renderType(
          'Agent type',
          'Select agent type',
          () => alert('agent'),
          '',
        )} */}

        <Block flex={false} padding={[0, w3]} margin={[t5, 0, 0]}>
          <Button onPress={() => onDrawSignature()} color="primary">
            Draw signature
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default MissionReport;
