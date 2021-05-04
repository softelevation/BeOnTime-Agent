import React from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {
  Block,
  Text,
  ImageComponent,
  Checkbox,
  Button,
  CustomButton,
} from '../../../components';
import {t1, t2, t3, w1} from '../../../components/theme/fontsize';

const SearchFilters = ({type, setType}) => {
  return (
    <Block flex={false} padding={[t3]}>
      <Text semibold margin={[t1, 0, 0]}>
        Search Filters
      </Text>
      <Block margin={[t1, 0, 0, 0]} flex={false} row center>
        <Text size={16} grey>
          Personalise your search results.
        </Text>
      </Block>
      <CustomButton
        // onPress={() => setType('hostess')}
        margin={[t1, 0, 0, 0]}
        flex={false}
        row
        center>
        <ImageComponent name="hostess_icon" height="40" width="40" />
        <Text margin={[0, w1]} size={16} grey>
          Hostesses
        </Text>
      </CustomButton>
      <CustomButton
        // onPress={() => setType('agents')}
        margin={[0, 0, 0, 0]}
        flex={false}
        row
        center>
        <ImageComponent name="agent_icon" height="40" width="40" />
        <Text margin={[0, w1]} size={16} grey>
          Agents
        </Text>
      </CustomButton>
      <Block row wrap>
        <Checkbox
          containerStyle={containerStyle}
          checkboxStyle={{height: 25, width: 25}}
          label="SSIAP 1"
        />
        <Checkbox
          containerStyle={containerStyle}
          checkboxStyle={{height: 25, width: 25}}
          label="SSIAP 2"
        />
        <Checkbox
          containerStyle={containerStyle}
          checkboxStyle={{height: 25, width: 25}}
          label="SSIAP 3"
        />
        <Checkbox
          checked
          containerStyle={containerStyle}
          checkboxStyle={{height: 25, width: 25}}
          label="ADS"
        />
        <Checkbox
          containerStyle={[containerStyle, {width: widthPercentageToDP(35)}]}
          checkboxStyle={{height: 25, width: 25}}
          label="Dog handler"
        />
        <Checkbox
          containerStyle={[containerStyle, {width: widthPercentageToDP(60)}]}
          checkboxStyle={{height: 25, width: 25}}
          label="Bodyguard (no weapon)"
          numberOfLabelLines={2}
        />
      </Block>
      {type ? (
        <Text size={16} grey margin={[t2, 0, 0, 0]} center>
          Select at least one agent type
        </Text>
      ) : (
        <Button style={{marginTop: t2}} color="secondary">
          Done
        </Button>
      )}
    </Block>
  );
};
const containerStyle = {marginTop: t1, width: widthPercentageToDP(28)};
export default SearchFilters;
