import React, { memo, useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import useWindowHeight from 'hooks/useWindowHeight';

import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';
import LoginLogoutButton from 'components/mapApp/loginLogoutButton/loginLogoutButton.component';
import Search from 'components/mapApp/search/search.component';
import Languages from 'components/mapApp/languages/languages.component';
import GoogleMapClubs from 'components/mapApp/googleMapClubs/googleMapClubs.component';

import ClubsStatus from 'components/mapApp/clubsStatus/clubsStatus.component';
import ClubsToggleShow from 'components/mapApp/clubsToggleShow/clubsToggleShow.component';

import PageOverlayRoute from 'common/pageOverlayRoute/pageOverlayRoute.component';

import Login from 'components/login/login.component';
import Register from 'components/register/register.component';
import Suggestion from 'components/mapApp/suggestion/suggestion.component';
import EmailConfirm from 'components/emailConfirm/emailConfirm.component';
import About from 'components/about/about.component';

function GoogleMapWrapper(props) {
  const {
    club: currentClub,
    clearClubs,
    retrieveClubs,
    refreshClubs,
  } = props;

  const [searchInputRef, setSearchInputRef] = useState(null);
  const windowHeight = useWindowHeight();

  const {
    isSidebarOpened,
    isLoadingClub,
  } = useSelector(state => ({
    isSidebarOpened: state.app.isSidebarOpened,
    isLoadingClub: state.app.isLoadingClub,
  }));

  const setSearchInputRefCallback = useCallback((ref) => {
    setSearchInputRef(ref);
  }, []);

  const pageOverlayRoutes = useMemo(() => [
    {
      path: '/login',
      component: Login,
    }, {
      path: '/register',
      component: Register,
    }, {
      path: '/suggestion',
      component: Suggestion,
      editType: 'new',
    }, {
      path: '/suggestion/:clubId',
      component: Suggestion,
      editType: 'edit',
    }, {
      path: '/confirm/:verificationCode',
      component: EmailConfirm,
    }, {
      path: '/about',
      component: About,
    }
  ], []);

  return (
    <div id="map-wrapper" className={classNames({ 'sidebar-opened': isSidebarOpened })} style={{ height: `${windowHeight}px` }}>
      <LoadingWrapper type="big" isLoading={isLoadingClub}>
        <LoginLogoutButton />
        <Search setSearchInputRef={setSearchInputRefCallback} />
        <ClubsStatus currentClub={currentClub} />
        <ClubsToggleShow currentClub={currentClub} />
        <GoogleMapClubs
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          windowHeight={windowHeight}
          searchInputRef={searchInputRef}
        />
        <Languages />
      </LoadingWrapper>

      {pageOverlayRoutes.map(({
        path,
        component,
        ...rest
      }) => (
        <PageOverlayRoute
          {...rest}
          key={path}
          path={path}
          component={component}
          clearClubs={clearClubs}
          retrieveClubs={retrieveClubs}
          refreshClubs={refreshClubs}
        />
      ))}
    </div>
  )
}

export default memo(GoogleMapWrapper);
