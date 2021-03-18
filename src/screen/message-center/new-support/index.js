import React from 'react';
import {FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Block, CustomButton, ImageComponent, Text} from '../../../components';
import Header from '../../../components/common/header';
import {t1, w1} from '../../../components/theme/fontsize';

const NewSupport = () => {
  const _renderItem = ({item, index}) => {
    return (
      <CustomButton
        row
        space="between"
        borderColorDeafult
        borderWidth={[0, 0, 1, 0]}
        margin={[0, 0, 0]}
        padding={[hp(1.5), w1]}
        flex={false}>
        <Text size={16} semibold>
          {item}
        </Text>
        <ImageComponent name="right_arrow_icon" height={20} width={20} />
      </CustomButton>
    );
  };
  return (
    <Block primary>
      <Header centerText="New Support Chat" />
      <Block margin={[t1]} flex={false}>
        <Text size={14} grey semibold>
          Select the mission for which you need support help.
        </Text>
        <Block
          borderColorDeafult
          margin={[t1, 0, 0]}
          borderWidth={[0, 0, 1, 0]}
          flex={false}
        />
        <FlatList
          data={['Patroling the chemical factory', 'Securing the area']}
          renderItem={_renderItem}
        />
      </Block>
    </Block>
  );
};

export default NewSupport;
