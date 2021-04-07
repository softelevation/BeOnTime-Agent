import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Block, CustomButton, ImageComponent, Text} from '../../../components';
import ActivityLoader from '../../../components/activityLoader';
import Header from '../../../components/common/header';
import {t1, t2, w1} from '../../../components/theme/fontsize';
import CommonApi from '../../../utils/CommonApi';

const initialState = {
  loading: false,
  newChat: [],
};
const NewSupport = () => {
  const [state, setstate] = useState(initialState);
  const {loading, newChat} = state;
  const navigation = useNavigation();

  useEffect(() => {
    setstate({
      ...state,
      loading: true,
    });
    CommonApi.fetchAppCommon('/agent/support-chat', 'get')
      .then((response) => {
        if (response.status === 1) {
          console.log(response.data);
          setstate({
            loading: false,
            newChat: response.data,
          });
        }
      })
      .catch((err) => {
        console.log(err, 'err');
        setstate({
          ...state,
          loading: true,
        });
      });
  }, []);
  const _renderItem = ({item, index}) => {
    return (
      <CustomButton
        onPress={() =>
          navigation.navigate('Chat', {
            id: item.id,
            name: item.title,
          })
        }
        row
        space="between"
        borderColorDeafult
        borderWidth={[0, 0, 1, 0]}
        margin={[0, 0, 0]}
        padding={[hp(1.5), w1]}
        flex={false}>
        <Text size={16} semibold>
          {item.title}
        </Text>
        <ImageComponent name="right_arrow_icon" height={20} width={20} />
      </CustomButton>
    );
  };
  return (
    <Block primary>
      <Header centerText="New Support Chat" />
      {loading && <ActivityLoader />}

      <Block margin={[t1]} flex={1}>
        <Text size={14} grey semibold>
          Select the mission for which you need support help.
        </Text>
        <Block
          borderColorDeafult
          margin={[t1, 0, 0]}
          borderWidth={[0, 0, 1, 0]}
          flex={false}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: t2}}>
          <FlatList
            scrollEnabled={false}
            data={newChat}
            renderItem={_renderItem}
          />
        </ScrollView>
      </Block>
    </Block>
  );
};

export default NewSupport;
