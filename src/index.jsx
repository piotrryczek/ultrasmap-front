import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from 'config/store';
import 'config/i18n';
import App from 'components/app/app.component';

import * as serviceWorker from './serviceWorker';
import './index.scss';

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));

serviceWorker.unregister();
