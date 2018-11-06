import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'react-moment';
import moment from 'moment';
import { Provider } from 'react-redux';
import { setConfig } from 'store/config';
import configureStore from 'store/configureStore';
import 'utils/polyfills';
import 'moment-timezone';
import App from 'App';

Moment.globalParse = 'YYYY-MM-DD HH:mm:ss';
moment.tz.setDefault('GMT');
setConfig(window.initialConfig);

ReactDOM.render(
  <Provider store={configureStore(window.initialState)}>
    <App />
  </Provider>,
  document.getElementById('mount')
);
