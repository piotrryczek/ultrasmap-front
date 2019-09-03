import React, { memo } from 'react';
import { Route } from 'react-router';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import Suggestion from 'components/mapApp/suggestion/suggestion.component';

function EditSuggestionRoute() {
  return (
    <Route exact path="/suggestion/:clubId" component={routeProps => <PageOverlay><Suggestion {...routeProps} editType="edit" /></PageOverlay>} />
  );
}

export default memo(EditSuggestionRoute);