/*
TODO:
- RWD
- unrelated clubs on the map depending on location, randomly loading more while scrolling
- viewing suggestions / map with suggestions
*/

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
