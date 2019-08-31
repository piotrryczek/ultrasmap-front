import React, { memo } from 'react';
import { Route } from 'react-router';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import EmailConfirm from 'components/emailConfirm/emailConfirm.component';

function ConfirmRoute() {
  return (
    <Route path="/confirm/:verificationCode" component={props => <PageOverlay><EmailConfirm {...props} /></PageOverlay>} />
  );
}

export default memo(ConfirmRoute);