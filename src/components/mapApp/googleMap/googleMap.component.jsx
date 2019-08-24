import React, { memo } from 'react';
import { GoogleMap, Marker, withScriptjs, withGoogleMap } from 'react-google-maps';

import { parseCoordinates } from 'util/helpers';

import Search from 'components/mapApp/search/search.component';
import Languages from 'components/mapApp/languages/languages.component';

const createRelations = club => {
  const {
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
  } = club;

  const relations = [...friendships, ...agreements, ...positives, ...satellites];

  if (satelliteOf) relations.push(satelliteOf);

  return relations;
}

const GoogleMapClubs = withScriptjs(withGoogleMap((props) => {
  const { club } = props;

  const relations = club ? createRelations(club) : [];

  return (
    <GoogleMap
      defaultZoom={8}
      center={{
        lat: 5,
        lng: 5,
      }}
    >
      {relations.map(relation => {
        const {
          _id: clubId,
          location,
          name,
          logo,
        } = relation;

        const coordinates = parseCoordinates(location.coordinates);

        return (
          <Marker
            key={clubId}
            defaultPosition={coordinates}
          />
        )
      })}
    </GoogleMap>
  );
}));

function GoogleMapClubsHOC(props) {
  const {
    retrieveClub,
  } = props;

  return (
    <div id="map-wrapper">
      <Search retrieveClub={retrieveClub} />
      <GoogleMapClubs
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '100vh' }} />}
        containerElement={<div style={{ height: '100vh' }} />}
        mapElement={<div style={{ height: '100vh' }} />}
      />
      <Languages />
    </div>
  )
}

export default GoogleMapClubsHOC;
