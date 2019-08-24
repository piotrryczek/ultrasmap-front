import React, { useState, useCallback } from 'react';
import {
  Router,
  Route,
} from 'react-router';

import history from 'config/history';

import MapApp from 'components/mapApp/mapApp.component';
import Login from 'components/login/login.component';
import Register from 'components/register/register.component';


function App() {

  return (
    <Router history={history}>
      <Route exact path="/" component={MapApp} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Router>
  );
}

export default App;
