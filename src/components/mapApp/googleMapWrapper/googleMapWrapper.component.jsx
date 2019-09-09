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

import LoginRoute from './routes/loginRoute.component';
import RegisterRoute from './routes/registerRoute.component';
import NewSuggestionRoute from './routes/newSuggestionRoute.component';
import EditSuggestionRoute from './routes/editSuggestionRoute.component';
import ConfirmRoute from './routes/confirmRoute.component';
import AboutRoute from './routes/aboutRoute.component';

function GoogleMapWrapper(props) {
  const {
    club: currentClub,
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

  // const divElMap = useMemo(() => <div style={{ height: `${windowHeight}px` }} />, [windowHeight]);

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

      <LoginRoute />
      <RegisterRoute />
      <NewSuggestionRoute />
      <EditSuggestionRoute />
      <ConfirmRoute />
      <AboutRoute />
    </div>
  )
}

export default memo(GoogleMapWrapper);