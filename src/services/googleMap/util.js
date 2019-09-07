import getDistance from 'geolib/es/getDistance';

import { parseCoordinates } from 'util/helpers';

export const getMaximumDistance = (currentClub, clubs) => {
  const modifier = 2.2;
  const clubsToCheck = clubs.filter(club => club._id !== currentClub._id);

  const metersSum = clubsToCheck.reduce((acc, club) => {
    acc += getDistance(
      {
        latitude: currentClub.latLng.lat,
        longitude: currentClub.latLng.lng},
      {
        latitude: club.latLng.lat,
        longitude: club.latLng.lng
      }
    );

    return acc;
  }, 0);

  const avarageDistance = metersSum / clubsToCheck.length;

  return avarageDistance * modifier;
};

export const getRelationColor = relationType => {
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

export const enhanceRelations = (clubs, relation) => clubs.map(club => ({
  ...club,
  relationType: relation,
  latLng: parseCoordinates(club.location.coordinates)
}));

export const getAllClubs = club => {
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