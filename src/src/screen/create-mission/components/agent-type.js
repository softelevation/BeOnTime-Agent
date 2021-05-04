import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {Block, Button, CustomButton, Text} from '../../../components';
import {t1, t3, w5} from '../../../components/theme/fontsize';

const AgentType = ({state, setValues, closeModal}) => {
  const [agent, setAgent] = useState({
    name: state.name,
    value: state.value,
  });
  const _renderItem = ({item}) => {
    return (
      <CustomButton
        margin={[t1, 0]}
        onPress={() => setAgent(item)}
        center
        borderRadius={10}
        middle
        color={item.name === agent.name ? '#000' : '#F5F7FA'}
        padding={[t1 * 1.5]}>
        <Text color={item.name === agent.name ? '#fff' : '#8A8E99'} size={16}>
          {item.name}
        </Text>
      </CustomButton>
    );
  };
  return (
    <Block padding={[t3, w5]}>
      <Text margin={[t1]} semibold center size={22}>
        Agent Type
      </Text>
      <FlatList
        data={[
          {
            name: 'SSIAP 1',
            value: 1,
          },
          {
            name: 'SSIAP 2',
            value: 2,
          },
          {
            name: 'SSIAP 3',
            value: 3,
          },
          {
            name: 'ADS',
            value: 4,
          },
          {
            name: 'Bodyguard (no weapon)',
            value: 5,
          },
          {
            name: 'Dog Handler',
            value: 6,
          },
          {
            name: 'Hostess',
            value: 7,
          },
        ]}
        renderItem={_renderItem}
      />
      <Button
        disabled={!agent.name}
        onPress={() => {
          setValues(agent);
          closeModal();
        }}
        color="secondary">
        Done
      </Button>
    </Block>
  );
};

export default AgentType;
