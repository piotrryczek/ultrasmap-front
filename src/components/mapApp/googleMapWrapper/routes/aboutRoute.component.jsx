import React, { memo } from 'react';
import { Route } from 'react-router';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import About from 'components/about/about.component';

function AboutRoute() {
  return (
    <Route exact path="/about" component={props => <PageOverlay><About {...props} /></PageOverlay>} />
  );
}

export default memo(AboutRoute);