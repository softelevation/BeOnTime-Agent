import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {Block, Button, CustomButton, Text} from '../../../components';
import {t1, t3, w5} from '../../../components/theme/fontsize';
import {strictValidArrayWithLength} from '../../../utils/commonUtils';
const data = [
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
];
const AgentType = ({state, setValues, closeModal}) => {
  const [agent, setAgent] = useState(state || []);

  const renderdata = (value) => {
    const agentFiltered = agent.filter((v) => v.name !== value.name);
    const isExist = agent.filter((v) => v.name === value.name);
    if (isExist.length) {
      setAgent([...agentFiltered]);
    } else {
      setAgent([...agentFiltered, value]);
    }
  };
  const _renderItem = ({item}) => {
    return (
      <CustomButton
        margin={[t1, 0]}
        onPress={() => renderdata(item)}
        center
        borderRadius={10}
        middle
        color={
          agent.filter((ele) => ele.value === item.value) > -1
            ? '#F5F7FA'
            : '#000'
        }
        padding={[t1 * 1.5]}>
        <Text
          color={
            agent.filter((ele) => ele.value === item.value) > -1
              ? '#8A8E99'
              : '#fff'
          }
          size={16}>
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
      <FlatList data={data} renderItem={_renderItem} />
      <Button
        disabled={!strictValidArrayWithLength(agent)}
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
