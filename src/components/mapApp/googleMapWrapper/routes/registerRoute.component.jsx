import React, { memo } from 'react';
import { Route } from 'react-router';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import Register from 'components/register/register.component';

function RegisterRoute() {
  return (
    <Route path="/register" component={props => <PageOverlay><Register {...props} /></PageOverlay>} />
  )
}

export default memo(RegisterRoute);