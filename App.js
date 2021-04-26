import React from 'react';
import Routes from './src/routes';
import {Provider} from 'react-redux';
import rootSaga from './src/redux/saga';
import FlashMessage from 'react-native-flash-message';
import {sagaMiddleware, store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'react-native';

sagaMiddleware.run(rootSaga);

const App = () => {
  return (
    <>
      <Provider store={store}>
        <StatusBar barStyle="dark-content" />
        <PersistGate loading={null} persistor={persistor}>
          <Routes />
        </PersistGate>
      </Provider>
      <FlashMessage position="top" />
    </>
  );
};

export default App;
