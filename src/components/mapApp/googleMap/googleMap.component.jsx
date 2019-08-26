/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router';
import { GoogleMap, Marker, OverlayView, Polyline, withGoogleMap } from 'react-google-maps';
import classNames from 'classnames';
import _get from 'lodash/get';

import { parseCoordinates } from 'util/helpers';
import { IMAGES_URL } from 'config/config';

import Login from 'components/login/login.component';
import Register from 'components/register/register.component';
import Suggestion from 'components/mapApp/suggestion/suggestion.component';
import SuggestAddNewClubButton from 'components/mapApp/suggestAddNewClubButton/suggestAddNewClubButton.component';
import LogoutButton from 'components/mapApp/logoutButton/logoutButton.component';
import Search from 'components/mapApp/search/search.component';
import Languages from 'components/mapApp/languages/languages.component';

const getRelationColor = relationType => {
  switch (relationType) {
    case 'friendship':
      return '#248232';

    case 'agreement':
      return '#0E79B2';

    case 'positive':
      return '#80DED9';

    case 'satellite':
    case 'satelliteOf':
      return '#420039';

    default:
      break;
  }
};

const enhanceRelations = (clubs, relation) => clubs.map(club => ({
  ...club,
  relationType: relation,
  latLng: parseCoordinates(club.location.coordinates)
}));

const getAllClubs = club => {
  const {
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
  } = club;

  Object.assign(club, {
    latLng: parseCoordinates(club.location.coordinates),
  });

  const relations = [
    club,
    ...enhanceRelations(friendships, 'friendship'),
    ...enhanceRelations(agreements, 'agreement'),
    ...enhanceRelations(positives, 'positive'),
    ...enhanceRelations(satellites, 'satellite')
  ];

  if (satelliteOf) {
    Object.assign(satelliteOf, {
      relationType: 'satelliteOf',
      latLng: parseCoordinates(satelliteOf.location.coordinates)
    });
    relations.push(satelliteOf);
  }

  return relations;
}

const GoogleMapClubs = withGoogleMap((props) => {
  const mapRef = useRef(null);
  const { club: currentClub, retrieveClub } = props;

  const allClubs = currentClub ? getAllClubs(currentClub) : [];

  if (allClubs.length) {
    const { current: map } = mapRef;
    
    const bounds = new window.google.maps.LatLngBounds();
    allClubs.forEach(club => {
      bounds.extend(new window.google.maps.LatLng(club.latLng));
    });

    map.fitBounds(bounds);
  }

  const handleChangeClub = useCallback(clubId => () => {
    retrieveClub(clubId);
  }, [currentClub]);

  const drawAll = (clubs) => {
    const [enhancedCurrentClub, ...relations] = allClubs;

    return (
      <>
        {clubs.map(club => {
          const {
            _id: clubId,
            latLng,
            name,
            logo,
            relationType,
          } = club;

          return (
            <Marker
              key={clubId}
              defaultPosition={latLng}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 0
              }}
            >
              <OverlayView
                key={clubId}
                position={latLng}
                mapPaneName="overlayMouseTarget"
              >
                <button
                  type="button"
                  className={classNames('club-marker', relationType)}
                  onClick={handleChangeClub(clubId)}
                >
                  <div className="name">{name}</div>
                  <div className="logo">
                    <img src={`${IMAGES_URL}/h30/${logo}`} alt="" />
                  </div>
                </button>
              </OverlayView>
            </Marker>
          )
        })}
        {relations.map(({
          _id: clubId,
          latLng,
          relationType,
        }) => (
          <Polyline
            key={clubId}
            path={[enhancedCurrentClub.latLng, latLng]}
            options={{
              strokeColor: getRelationColor(relationType),
              strokeOpacity: 0.5,
              strokeWeight: 6,
            }}
          />
        ))}
      </>
    )
  }

  return (
    <GoogleMap
      ref={mapRef}
      defaultZoom={8}
      center={{
        lat: 51.5017725,
        lng: 20.4335716,
      }}
      options={{
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          mapTypeIds: [window.google.maps.MapTypeId.ROADMAP]
        },
      }}
    >
      {allClubs.length > 0 && drawAll(allClubs)}
    </GoogleMap>
  );
});

function GoogleMapClubsHOC(props) {
  const {
    retrieveClub,
  } = props;

  const { isAuthenticated } = useSelector(state => ({ isAuthenticated: _get(state, 'app.isAuthenticated', false) }));

  return (
    <div id="map-wrapper">
      {isAuthenticated && <LogoutButton />}
      <Search retrieveClub={retrieveClub} />
      <SuggestAddNewClubButton />
      <GoogleMapClubs
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '100vh' }} />}
        containerElement={<div style={{ height: '100vh' }} />}
        mapElement={<div style={{ height: '100vh' }} />}
      />
      <Languages />

      <Route exact path="/suggestion" component={props => <Suggestion {...props} editType="new" />} />
      <Route path="/suggestion/:clubId" component={props => <Suggestion {...props} editType="edit" />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </div>
  )
}

export default GoogleMapClubsHOC;
