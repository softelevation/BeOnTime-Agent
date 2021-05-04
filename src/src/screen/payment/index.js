import React, {useEffect, useRef, useState} from 'react';

import {
  Block,
  Button,
  Checkbox,
  CustomButton,
  Input,
  Text,
} from '../../components';
import Header from '../../components/common/header';
import * as yup from 'yup';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {t1, t2, w1, w3, w4} from '../../components/theme/fontsize';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  strictValidObjectWithKeys,
  strictValidString,
  strictValidStringWithMinLength,
} from '../../utils/commonUtils';
import {
  getCardType,
  cc_format,
  cc_expires_format,
  getCardColor,
} from '../../utils/site-specific-common-utils';
import {divider} from '../../utils/commonView';
import {makePaymentRequest} from '../../redux/action';
import {useNavigation} from '@react-navigation/native';
import {makePaymentFlush} from '../../redux/payments/action';

const Payment = () => {
  const formikRef = useRef();
  const dispatch = useDispatch();
  const mission = useSelector(
    (state) => state.agents.bookAgennts.bookAgents.data,
  );
  const isLoad = useSelector((state) => state.payment.makePayment.loading);
  const isSuccess = useSelector((state) => state.payment.makePayment.isSuccess);
  const [visible, setvisible] = useState(false);
  const {id, total_mission_amount} =
    strictValidObjectWithKeys(mission) && mission;
  const navigation = useNavigation();

  const renderType = (header, content) => {
    return (
      <Block
        margin={[heightPercentageToDP(0.5), 0]}
        row
        flex={false}
        space="between">
        <Text size={16}>{header}</Text>
        <Text grey size={16}>
          {content}
        </Text>
      </Block>
    );
  };
  useEffect(() => {
    if (isSuccess === true) {
      setvisible(true);
    }
  }, [isSuccess]);
  const onSubmit = (values) => {
    const {cc_number, cc_expiry, cc_cvv} = values;
    const splittedExpiry = cc_expiry.split('/');
    const data = {
      card_number: cc_number.toString().split(' ').join(''),
      exp_month: splittedExpiry[0],
      exp_year: splittedExpiry[1],
      cvc: cc_cvv,
      mission_id: id,
    };
    dispatch(makePaymentRequest(data));
  };
  return (
    <Block primary>
      <Header centerText="Final Payment" />
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          type: 'card',
          cc_number: '',
          cc_holder: '',
          cc_expiry: '',
          cc_cvv: '',
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          cc_number: yup
            .string()
            .test('wrong card', (value) => {
              const formattedValue =
                (value && value.toString().split(' ').join('')) || '';
              return strictValidString(getCardType(formattedValue));
            })
            .required(),
          cc_holder: yup.string().required(),
          cc_expiry: yup
            .string()
            .max(5)
            .matches(
              /([0-9]{2})\/([0-9]{2})/,
              'Not a valid expiration date. Example: MM/YY',
            )
            .required('Expiration date is required'),
          cc_cvv: yup.string().min(3).max(4).required(),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          setFieldValue,
          handleSubmit,
          dirty,
          isValid,
        }) => {
          const formattedValue =
            (strictValidString(values.cc_number) &&
              values.cc_number.toString().split(' ').join('')) ||
            '';
          const cardType = getCardType(formattedValue);
          const cardImage = getCardColor(cardType);

          return (
            <>
              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}>
                <Block
                  center
                  middle
                  primary
                  margin={[t2, 0]}
                  color={'#F7F8FA'}
                  borderRadius={30}
                  alignSelf="center"
                  row
                  flex={false}>
                  <CustomButton
                    onPress={() => setFieldValue('type', 'card')}
                    center
                    middle
                    borderRadius={30}
                    padding={
                      values.type === 'card'
                        ? [heightPercentageToDP(1.5), widthPercentageToDP(4)]
                        : [0, widthPercentageToDP(4)]
                    }
                    color={values.type === 'card' ? '#FFFFFF' : '#F7F8FA'}
                    shadow={values.type === 'card'}
                    margin={[0, w1]}>
                    <Text size={14}>Card Payment</Text>
                  </CustomButton>
                  <CustomButton
                    onPress={() => setFieldValue('type', 'bank')}
                    center
                    middle
                    borderRadius={20}
                    padding={
                      values.type === 'bank'
                        ? [heightPercentageToDP(1.5), widthPercentageToDP(4)]
                        : [0, widthPercentageToDP(4)]
                    }
                    color={values.type === 'bank' ? '#FFFFFF' : '#F7F8FA'}
                    shadow={values.type === 'bank'}>
                    <Text size={14} semibold>
                      Bank Transfer
                    </Text>
                  </CustomButton>
                </Block>
                {values.type === 'card' ? (
                  <Block flex={false} padding={[0, w4]}>
                    <Text>Card Details</Text>
                    <Input
                      label="Cardholder name"
                      placeholder="Enter your full name"
                      value={values.cc_holder}
                      onChangeText={handleChange('cc_holder')}
                      onBlur={() => setFieldTouched('cc_holder')}
                      error={touched.cc_holder && errors.cc_holder}
                    />
                    <Block row space={'between'} flex={false}>
                      <Input
                        style={{width: widthPercentageToDP(50)}}
                        label="Card number"
                        placeholder="0000-0000-0000-0000"
                        value={values.cc_number}
                        number
                        selectTextOnFocus={
                          !strictValidStringWithMinLength(values.id)
                        }
                        onChangeText={(e) => {
                          const CCFormatted = cc_format(e);
                          setFieldValue('cc_number', CCFormatted);
                        }}
                        maxLength={19}
                        onBlur={() => setFieldTouched('cc_number')}
                        error={touched.cc_number && errors.cc_number}
                        rightLabel={cardImage}
                      />
                      <Input
                        style={{width: widthPercentageToDP(15)}}
                        maxLength={5}
                        label="Date"
                        placeholder="00/00"
                        number
                        value={values.cc_expiry}
                        onChangeText={(e) => {
                          const CCFormatted = cc_expires_format(e);
                          setFieldValue('cc_expiry', CCFormatted);
                        }}
                        onBlur={() => {
                          setFieldTouched('cc_expiry');
                        }}
                        error={touched.cc_expiry && errors.cc_expiry}
                      />
                      <Input
                        style={{width: widthPercentageToDP(12)}}
                        maxLength={3}
                        label="CVV"
                        placeholder="000"
                        type="number"
                        number
                        secureTextEntry
                        value={values.cc_cvv}
                        onChangeText={handleChange('cc_cvv')}
                        onBlur={() => setFieldTouched('cc_cvv')}
                        error={touched.cc_expiry && errors.cc_expiry}
                      />
                    </Block>
                    <Block margin={[t1, 0]} row center>
                      <Checkbox
                        onChange={() => setFieldValue('terms', !values.terms)}
                        checkboxStyle={{height: 25, width: 25}}
                        label=""
                        checked={values.terms}
                      />
                      <Text size={12}>
                        Save card information for future payments.
                      </Text>
                    </Block>
                  </Block>
                ) : (
                  <Block flex={false} padding={[0, w4]}>
                    <Text size={12} grey>
                      IBAN NUMBER
                    </Text>
                    <Text height={40} semibold size={22}>
                      FR76 1287900 0199 1294 8300 103
                    </Text>
                    <Block flex={false} margin={[t1, 0]}>
                      {renderType('Code BANQUE', '12879')}
                      {renderType('Numero de COMPTE', '99129483001')}
                      {renderType('Code GUICHET', '00001')}
                      {renderType('Code BIC', 'DELUFR22XXXX')}
                      {renderType('Domiciliation', 'FRANCE')}
                    </Block>
                    {divider()}
                    {renderType('Titulare de compte', 'BE ON TIME SAS')}
                    {renderType('', '13 rue Washington')}
                    {renderType('', '75008 Paris')}
                    {renderType('', 'France')}
                  </Block>
                )}
              </KeyboardAwareScrollView>
              <Block
                row
                space="between"
                center
                flex={false}
                padding={[t2]}
                borderWidth={[1, 0, 0, 0]}
                borderColorDeafult>
                <Block flex={false}>
                  <Text semibold>Total Amount</Text>
                  <Text margin={[heightPercentageToDP(0.5), 0]} grey size={16}>
                    Including VAT
                  </Text>
                </Block>
                <Text size={40} bold>
                  {`$${total_mission_amount}`}
                </Text>
              </Block>
              <Block flex={false} padding={[0, w4, t2]}>
                <Button
                  isLoading={isLoad}
                  disabled={!dirty}
                  onPress={
                    values.type === 'card'
                      ? handleSubmit
                      : () => setvisible(true)
                  }
                  color="secondary">
                  {values.type === 'card' ? 'Make Payment' : 'Finish'}
                </Button>
              </Block>
            </>
          );
        }}
      </Formik>
    </Block>
  );
};

export default Payment;
