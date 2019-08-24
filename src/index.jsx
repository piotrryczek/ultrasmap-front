import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/app/app.component';

import * as serviceWorker from './serviceWorker';
import './index.scss';
import 'typeface-roboto';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
