import React, { memo, useCallback } from 'react';
import { Route } from 'react-router';
import { isMobile, isTablet } from 'react-device-detect';
import { useDispatch } from 'react-redux';

import history from 'config/history';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import { showSidebar, setIsLoadingClubsDisabled } from 'components/app/app.actions';

function PageOverlayRoute(props) {
  const {
    path,
    component: PassedComponent,
    clearClubs,
    refreshClubs,
    retrieveClubs,
    ...rest
  } = props;

  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(setIsLoadingClubsDisabled(false));
    if (!isMobile && !isTablet && window.innerWidth > 800) {
      dispatch(showSidebar());
    } else {
      refreshClubs();
      retrieveClubs();
    }

    history.push('/');
  }, [refreshClubs, retrieveClubs]);

  return (
    <Route
      exact
      path={path}
      component={routeProps => (
        <PageOverlay
          clearClubs={clearClubs}
          handleClose={handleClose}
        >
          <PassedComponent
            {...routeProps}
            {...rest}
            handleClose={handleClose}
          />
        </PageOverlay>
      )}
    />
  );
}

export default memo(PageOverlayRoute);
