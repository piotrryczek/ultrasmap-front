import React, { memo } from 'react';
import { Route } from 'react-router';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import Suggestion from 'components/mapApp/suggestion/suggestion.component';

function NewSuggestionRoute() {
  return (
    <Route exact path="/suggestion" component={props => <PageOverlay><Suggestion {...props} editType="new" /></PageOverlay>} />
  );
}

export default memo(NewSuggestionRoute);