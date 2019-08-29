import React, { memo, useMemo } from 'react';
import { Route } from 'react-router';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import Login from 'components/login/login.component';
import Register from 'components/register/register.component';
import Suggestion from 'components/mapApp/suggestion/suggestion.component';
import EmailConfirm from 'components/emailConfirm/emailConfirm.component';
import LoginLogoutButton from 'components/mapApp/loginLogoutButton/loginLogoutButton.component';
import Search from 'components/mapApp/search/search.component';
import Languages from 'components/mapApp/languages/languages.component';
import GoogleMapClubs from 'components/mapApp/googleMapClubs/googleMapClubs.component';

function GoogleMapClubsHOC(props) {
  const {
    retrieveClub,
  } = props;

  const isSidebarOpened = useSelector(state => state.app.isSidebarOpened);

  const divElMap = useMemo(() => <div style={{ height: '100vh' }} />, []);

  return (
    <div id="map-wrapper" className={classNames({ 'sidebar-opened': isSidebarOpened })}>
      <LoginLogoutButton />
      <Search retrieveClub={retrieveClub} />
      <GoogleMapClubs
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={divElMap}
        containerElement={divElMap}
        mapElement={divElMap}
      />
      <Languages />

      <Route exact path="/suggestion" component={props => <Suggestion {...props} editType="new" />} />
      <Route path="/suggestion/:clubId" component={props => <Suggestion {...props} editType="edit" />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/confirm/:verificationCode" component={EmailConfirm} />
    </div>
  )
}

export default memo(props => <GoogleMapClubsHOC {...props} />);
