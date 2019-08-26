import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from 'config/store';
import App from 'components/app/app.component';

import * as serviceWorker from './serviceWorker';
import './index.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));

serviceWorker.unregister();
