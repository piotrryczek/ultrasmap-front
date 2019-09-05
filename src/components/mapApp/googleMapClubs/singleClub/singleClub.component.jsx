import React, { memo } from 'react';
import { Polyline } from 'react-google-maps';
import getDistance from 'geolib/es/getDistance';

import { getMaximumDistance, parseCoordinates } from 'util/helpers';
import ClubMarker from 'components/mapApp/googleMapClubs/clubMarker/clubMarker.component';

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

function SingleClub(props) {
  const {
    currentClub,
    forwardRef: mapRef,
  } = props;

  const allClubs = currentClub ? getAllClubs(currentClub) : [];

  const [enhancedCurrentClub, ...relations] = allClubs;

  if (allClubs.length) {
    const maximumDistance = getMaximumDistance(currentClub, allClubs);
    const { current: { context: { __SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: map } } } = mapRef; // It's secure

    let boundsCounter = 0;
    const bounds = new window.google.maps.LatLngBounds();

    for (const club of allClubs) {
      if (getDistance({ latitude: currentClub.latLng.lat, longitude: currentClub.latLng.lng}, { latitude: club.latLng.lat, longitude: club.latLng.lng }) < maximumDistance) {
        bounds.extend(new window.google.maps.LatLng(club.latLng));
        boundsCounter += 1;
      }
    }

    if (boundsCounter > 1) {
      map.fitBounds(bounds, {
        top: 90,
        bottom: 35,
        left: 35,
        right: 35,
      });
    } else {
      map.setCenter(new window.google.maps.LatLng(allClubs[0].latLng)); 
    }
  }

  return (
    <>
      {allClubs.map(club => <ClubMarker key={club._id} club={club} currentClub={currentClub} /> )}
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

export default memo(SingleClub);
