/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../components/common/header';
import {
  Block,
  CustomButton,
  ImageComponent,
  Input,
  Text,
} from '../../../components';
import {t1, t2, w3} from '../../../components/theme/fontsize';
import {connect, useDispatch} from 'react-redux';
import {
  getChatByIdFlush,
  getChatByIdRequest,
} from '../../../redux/messages/action';
import AsyncStorage from '@react-native-community/async-storage';
import {strictValidString} from '../../../utils/commonUtils';
const Chat = ({
  route: {params: {id, name} = {}} = {},
  callGetChatByIdApi,
  chatMessages,
  socket,
}) => {
  const flatlistRef = useRef();
  const [messages, setMessages] = useState('');
  const [loader, setloader] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChatByIdRequest(id));
    return () => {
      dispatch(getChatByIdFlush());
    };
  }, []);

  useEffect(() => {
    socket.on(`message_center_${id}`, (msg) => {
      dispatch(getChatByIdRequest(id));
    });
  }, []);

  const sendMessage = async () => {
    setloader(true);
    const token = await AsyncStorage.getItem('token');
    const data = {
      mission_id: id,
      token: token,
      message: messages,
      type: 'send_by_agent',
    };
    console.log(data);
    socket.emit('message_center', data);
    setMessages('');
    setTimeout(() => {
      setloader(false);
    }, 2000);
  };

  const _renderItem = ({item}) => {
    return (
      <Block
        alignSelf={item.message_type === 'send_by_agent' && 'flex-end'}
        style={{width: wp(60)}}
        borderRadius={10}
        shadow
        color={item.message_type === 'send_by_agent' ? '#000' : '#F7F8FA'}
        padding={[t2]}
        margin={[t1, w3]}
        flex={false}>
        <Text
          regular
          color={item.message_type === 'send_by_agent' ? '#fff' : '#8A8E99'}
          size={14}>
          {item.message}
        </Text>
      </Block>
    );
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? heightPercentageToDP(0) : t2
      }
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flexGrow: 1, backgroundColor: '#fff'}}>
      <Header centerText={name} bottomText={`Misn0${id}`} />
      <Block primary>
        <FlatList
          ref={flatlistRef}
          showsVerticalScrollIndicator={false}
          // onContentSizeChange={() => flatlistRef.current.scrollToEnd()}
          data={chatMessages}
          renderItem={_renderItem}
        />
      </Block>
      <Block
        shadow
        space={'between'}
        center
        row
        white
        flex={false}
        padding={[t1, t1]}>
        <Input
          transparent
          style={{width: wp(75)}}
          placeholder={'Type your message...'}
          value={messages}
          onChangeText={(v) => setMessages(v)}
        />
        <CustomButton
          flex={false}
          disabled={!strictValidString(messages)}
          onPress={() => sendMessage()}
          borderRadius={40}
          center
          middle
          secondary
          style={buttonStyle}>
          {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ImageComponent name="message_send_icon" height="22" width="22" />
          )}
        </CustomButton>
      </Block>
    </KeyboardAvoidingView>
  );
};
const buttonStyle = {
  height: 40,
  width: 40,
};
const mapStateToProps = (state) => {
  return {
    chatMessages: state.messages.chatById.data,
    isLoad: state.messages.chatById.loading,
    socket: state.socket.data,
  };
};
// const mapDispatchToProps = (dispatch) => {
//   return {
//     // dispatching plain actions
//     callGetChatByIdApi: (...params) => dispatch(getChatByIdRequest(...params)),
//   };
// };

export default connect(mapStateToProps)(Chat);
