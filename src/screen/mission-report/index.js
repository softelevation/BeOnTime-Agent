import React, {useState, useRef, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Block,
  Button,
  ImageComponent,
  Text,
  CustomButton,
  Input,
} from '../../components';
import Header from '../../components/common/header';
import {Modalize} from 'react-native-modalize';
import {t1, w3} from '../../components/theme/fontsize';
import {
  allumeeData,
  circulationData,
  EffractionData,
  fonctionData,
  meteoData,
  MissionType,
  ouvertesData,
  RemiseData,
  systemData,
  verificationData,
} from '../../utils/data';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';
import CommonApi from '../../utils/CommonApi';
import {ActivityIndicator, ScrollView, View, Image} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import {Formik} from 'formik';
import TypeForm from '../../common/types';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alerts,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';
import {
  missionReportSubmitFlush,
  missionReportSubmitRequest,
} from '../../redux/request/action';
import {styles} from '../../utils/common-styles';
import Modal from 'react-native-modal';
import {config} from '../../utils/config';

const MissionReport = ({
  route: {
    params: {item = {}},
  },
}) => {
  const [modal, setmodal] = useState(false);
  const [addSignature, setAddSignature] = useState(false);
  const modalizeRef = useRef();
  const [action, setAction] = useState('');
  const dispatch = useDispatch();
  const [scroll, setScroll] = useState(true);
  const ref = useRef();
  const [missionReport, setMissionReport] = useState({});
  const formikRef = useRef();
  const [signature, setSignature] = useState(null);
  const navigation = useNavigation();
  const loader = useSelector((state) => state.request.missionReport.loading);
  const isSuccess = useSelector(
    (state) => state.request.missionReport.isSuccess,
  );

  const {report} = missionReport;
  useEffect(() => {
    if (isSuccess === true) {
      setmodal(true);
    }
    onDrawSignature();
    return () => {
      dispatch(missionReportSubmitFlush());
    };
  }, [isSuccess]);
  const onDrawSignature = async () => {
    setAddSignature(true);
  };
  const handleSignature = (v) => {
    setSignature(v);
  };

  const handleEmpty = () => {};

  const handleClear = () => {
    setSignature(null);
  };

  const handleEnd = () => {
    ref.current.readSignature();
  };

  const formatDate = (d) => {
    return moment(d).format('YYYY-MM-DD');
  };
  const formatTime = (d) => {
    return moment(d).format('HH:mm');
  };
  const onSubmit = (values) => {
    const danger = light.danger;
    if (values.description === '') {
      Alerts('', 'Please Enter valid description', danger);
    } else if (values.meteo === '') {
      Alerts('', 'Please choose valid Constat météo', danger);
    } else if (values.circulation === '') {
      Alerts('', 'Please choose valid Circulation', danger);
    } else if (values.verification === '') {
      Alerts('', 'Please choose valid Circuit de Vérification', danger);
    } else if (values.allumee === '') {
      Alerts('', 'Please choose valid Lumiere allume', danger);
    } else if (values.ouvertes === '') {
      Alerts('', 'Please choose valid Issues(s) ouvertes', danger);
    } else if (values.fonction === '') {
      Alerts('', 'Please Echoose valid Sirene en fonction', danger);
    } else if (values.systeme === '') {
      Alerts('', 'Please choose valid Systeme', danger);
    } else if (values.remise === '') {
      Alerts('', 'Please choose valid Remise en service du systeme', danger);
    } else if (values.effraction === false) {
      Alerts('', 'Please choose valid Effraction constatee', danger);
    } else {
      const {
        description,
        meteo,
        circulation,
        verification,
        allumee,
        ouvertes,
        fonction,
        systeme,
        remise,
        effraction,
      } = values;

      const data = {
        mission_id: item.id,
        intervention: MissionType(report.intervention),
        date: formatDate(report.start_date_time),
        heure_appel: formatTime(report.assigned_at),
        heure_arivve: formatTime(report.started_at),
        heure_de_depart: formatTime(report.ended_at),
        constat_meteo: meteo.value,
        description: description,
        circulation: circulation.value,
        circuit_de_verification: verification.value,
        lumiere_allumee: allumee.value,
        issues_ouvertes: ouvertes.value,
        sirene_en_fonction: fonction.value,
        systeme: systeme.value,
        remise_en_service_du_systeme: remise.value,
        effraction_constatee: effraction.value,
        signature: signature,
      };
      console.log(data);
      dispatch(missionReportSubmitRequest(data));
    }
  };
  const renderType = (label, description, onPress, value, disabled) => {
    return (
      <CustomButton
        disabled={disabled}
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
  const onOpen = (type) => {
    modalizeRef.current?.open();
    setAction(type);
  };
  const onClose = (type) => {
    modalizeRef.current?.close();
    setAction('');
  };
  useEffect(() => {
    CommonApi.fetchAppCommon(`/agent/mission/${item.id}`, 'get', '')
      .then((response) => {
        if (response.status === 1) {
          setMissionReport(response.data);
          // Alerts(response.message, '', color);
        }
      })
      .catch((err) => {});
  }, [item.id]);

  console.log(missionReport, 'missionReport');

  if (!strictValidObjectWithKeys(missionReport)) {
    return (
      <Block>
        <Header centerText="Mission Report" leftIcon={false} />
        <Block center middle>
          <ActivityIndicator color="#000" size="large" />
        </Block>
      </Block>
    );
  } else {
    return (
      <Block white>
        <Header centerText="Mission Report" leftIcon={false} />
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={{
            description:
              (strictValidObjectWithKeys(report) && report.description) || '',
            meteo: {
              name:
                (strictValidObjectWithKeys(report) && report.constat_meteo) ||
                '',
              value:
                (strictValidObjectWithKeys(report) && report.constat_meteo) ||
                '',
            },

            circulation: {
              name:
                (strictValidObjectWithKeys(report) && report.circulation) || '',
              value:
                (strictValidObjectWithKeys(report) && report.circulation) || '',
            },
            verification: {
              name:
                (strictValidObjectWithKeys(report) &&
                  report.circuit_de_verification) ||
                '',
              value:
                (strictValidObjectWithKeys(report) &&
                  report.circuit_de_verification) ||
                '',
            },
            allumee: {
              name:
                (strictValidObjectWithKeys(report) && report.lumiere_allumee) ||
                '',
              value:
                (strictValidObjectWithKeys(report) && report.lumiere_allumee) ||
                '',
            },
            ouvertes: {
              name:
                (strictValidObjectWithKeys(report) && report.issues_ouvertes) ||
                '',
              value:
                (strictValidObjectWithKeys(report) && report.issues_ouvertes) ||
                '',
            },
            fonction: {
              name:
                (strictValidObjectWithKeys(report) &&
                  report.sirene_en_fonction) ||
                '',
              value:
                (strictValidObjectWithKeys(report) &&
                  report.sirene_en_fonction) ||
                '',
            },
            systeme: {
              name: (strictValidObjectWithKeys(report) && report.systeme) || '',
              value:
                (strictValidObjectWithKeys(report) && report.systeme) || '',
            },
            remise: {
              name:
                (strictValidObjectWithKeys(report) &&
                  report.remise_en_service_du_systeme) ||
                '',
              value:
                (strictValidObjectWithKeys(report) &&
                  report.remise_en_service_du_systeme) ||
                '',
            },
            effraction: {
              name:
                (strictValidObjectWithKeys(report) &&
                  report.effraction_constatee) ||
                '',
              value:
                (strictValidObjectWithKeys(report) &&
                  report.effraction_constatee) ||
                '',
            },
          }}
          onSubmit={onSubmit}>
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
          }) => (
            <>
              <ScrollView scrollEnabled={scroll}>
                <View onStartShouldSetResponderCapture={() => setScroll(true)}>
                  <Block padding={[t1]}>
                    <Text align={'center'} size={16}>
                      {item.phone}
                    </Text>
                  </Block>
                  <Block padding={[0, w3]} flex={false}>
                    <Input
                      label="Description"
                      value={values.description}
                      onChangeText={handleChange('description')}
                      onBlur={() => setFieldTouched('description')}
                      error={touched.description && errors.description}
                      editable={true}
                    />
                  </Block>

                  {renderType(
                    'Mission type',
                    '',
                    () => console.log('Mission'),
                    report.intervention,
                  )}

                  {renderType(
                    'Date',
                    '',
                    () => console.log('Date'),
                    formatDate(report.start_date_time),
                  )}

                  {renderType(
                    'Heure appel',
                    '',
                    () => console.log('Date'),
                    formatTime(report.assigned_at),
                  )}

                  {renderType(
                    'Heure arivve',
                    '',
                    () => console.log('Date'),
                    formatTime(report.started_at),
                  )}

                  {renderType(
                    'Heure de depart',
                    '',
                    () => console.log('Date'),
                    formatTime(report.ended_at),
                  )}

                  {renderType(
                    'Constat meteo',
                    '',
                    () => onOpen('meteo'),
                    values.meteo.name,
                    report.constat_meteo,
                  )}

                  {renderType(
                    'Circulation',
                    '',
                    () => onOpen('circulation'),
                    values.circulation.name,
                    report.circulation,
                  )}

                  {renderType(
                    'Circuit de Verification',
                    '',
                    () => onOpen('verification'),
                    values.verification.name,
                    report.circuit_de_verification,
                  )}

                  {renderType(
                    'Lumiere allume',
                    '',
                    () => onOpen('allumee'),
                    values.allumee.name,
                    report.lumiere_allumee,
                  )}

                  {renderType(
                    'Issues(s) ouvertes',
                    '',
                    () => onOpen('ouvertes'),
                    values.ouvertes.name,
                    report.issues_ouvertes,
                  )}

                  {renderType(
                    'Sirene en fonction',
                    '',
                    () => onOpen('fonction'),
                    values.fonction.name,
                    report.sirene_en_fonction,
                  )}

                  {renderType(
                    'Systeme',
                    '',
                    () => onOpen('systeme'),
                    values.systeme.name,
                    report.systeme,
                  )}

                  {renderType(
                    'Remise en service du systeme',
                    '',
                    () => onOpen('remise'),
                    values.remise.name,
                    report.remise_en_service_du_systeme,
                  )}

                  {renderType(
                    'Effraction constatee',
                    '',
                    () => onOpen('effraction'),
                    values.effraction.name,
                    report.effraction_constatee,
                  )}
                </View>

                {!strictValidString(report.signature) && (
                  <View style={{padding: 16}}>
                    <Text margin={[0, 0, hp(2)]} color="black" size={20}>
                      Signature
                    </Text>
                    {addSignature ? (
                      <View
                        onStartShouldSetResponderCapture={() =>
                          setScroll(false)
                        }
                        style={{height: 300}}>
                        <SignatureScreen
                          ref={ref}
                          onEnd={handleEnd}
                          onOK={handleSignature}
                          onEmpty={handleEmpty}
                          onClear={handleClear}
                          dataURL={
                            strictValidObjectWithKeys(report) &&
                            report.signature
                          }
                        />
                      </View>
                    ) : null}

                    {strictValidObjectWithKeys(report) &&
                      !strictValidNumber(report.id) && (
                        <>
                          <Button
                            onPress={() => onDrawSignature()}
                            color="primary">
                            Draw signature
                          </Button>
                          <Button
                            isLoading={loader}
                            onPress={handleSubmit}
                            color="secondary">
                            Finish Mission
                          </Button>
                        </>
                      )}
                  </View>
                )}

                {strictValidString(report.signature) && (
                  <View style={{padding: 16}}>
                    <Text margin={[t1, 0]} black semibold>
                      Signature
                    </Text>
                    <Block center middle color="#F7F8FA" flex={false}>
                      <Image
                        source={{
                          uri: `${config.Api_Url}/${report.signature}`,
                        }}
                        style={{height: 200, width: 300}}
                      />
                    </Block>
                  </View>
                )}
              </ScrollView>
              <Modalize
                adjustToContentHeight={true}
                handlePosition="inside"
                ref={modalizeRef}>
                {action === 'meteo' && (
                  <TypeForm
                    Header="Constat meteo"
                    data={meteoData}
                    state={values.meteo}
                    setValues={(v) => setFieldValue('meteo', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'circulation' && (
                  <TypeForm
                    Header="Circulation"
                    data={circulationData}
                    state={values.circulation}
                    setValues={(v) => setFieldValue('circulation', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'verification' && (
                  <TypeForm
                    Header="Circuit de Verification"
                    data={verificationData}
                    state={values.verification}
                    setValues={(v) => setFieldValue('verification', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'allumee' && (
                  <TypeForm
                    Header="Lumiere allume"
                    data={allumeeData}
                    state={values.allumee}
                    setValues={(v) => setFieldValue('allumee', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'ouvertes' && (
                  <TypeForm
                    Header="Issues(s) ouvertes"
                    data={ouvertesData}
                    state={values.ouvertes}
                    setValues={(v) => setFieldValue('ouvertes', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'fonction' && (
                  <TypeForm
                    Header="Sirene en fonction"
                    data={fonctionData}
                    state={values.fonction}
                    setValues={(v) => setFieldValue('fonction', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'systeme' && (
                  <TypeForm
                    Header="Systeme"
                    data={systemData}
                    state={values.systeme}
                    setValues={(v) => setFieldValue('systeme', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'remise' && (
                  <TypeForm
                    Header="Remise en service du systeme"
                    data={RemiseData}
                    state={values.remise}
                    setValues={(v) => setFieldValue('remise', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
                {action === 'effraction' && (
                  <TypeForm
                    Header="Effraction constatee"
                    data={EffractionData}
                    state={values.effraction}
                    setValues={(v) => setFieldValue('effraction', v)}
                    closeModal={() => {
                      onClose();
                    }}
                  />
                )}
              </Modalize>
            </>
          )}
        </Formik>
        <Modal
          style={styles.modalStyle}
          isVisible={modal}
          onBackdropPress={() => setmodal(false)}>
          <View style={styles.modalView}>
            <Text semibold style={styles.modalText}>
              {'Success !'}
            </Text>
            <Text style={styles.textStyle} center>
              Mission is finished.
            </Text>
            <Button
              style={styles.button}
              onPress={() => {
                setmodal(false);
                navigation.goBack();
              }}
              color="secondary">
              Close
            </Button>
          </View>
        </Modal>
      </Block>
    );
  }
};

export default MissionReport;
