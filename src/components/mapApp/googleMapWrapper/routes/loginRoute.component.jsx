import React, { memo } from 'react';
import { Route } from 'react-router';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import Login from 'components/login/login.component';

function LoginRoute() {
  return (
    <Route path="/login" component={props => <PageOverlay><Login {...props} /></PageOverlay>} />
  );
}

export default memo(LoginRoute);