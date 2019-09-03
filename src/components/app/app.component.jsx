import React from 'react';
import { Router, Route, Switch } from 'react-router';

import { MuiThemeProvider } from '@material-ui/core/styles';

import theme from 'theme/muiTheme';
import history from 'config/history';

import MapApp from 'components/mapApp/mapApp.component';
import ApiErrorMessage from 'components/apiErrorMessage/apiErrorMessage.component';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router history={history}>
        <Switch>
          <Route path="/club/:clubId" component={MapApp} />
          <Route path="/" component={MapApp} />
        </Switch>
      </Router>
      <ApiErrorMessage />
    </MuiThemeProvider>
  );
}

export default App;
