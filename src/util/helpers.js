import getDistance from 'geolib/es/getDistance';

export const parseCoordinates = (coordinates) => {
  return coordinates.reduce((acc, el, index) => {
    const property = index === 0 ? 'lat' : 'lng';
    acc[property] = el;

    return acc;
  }, {})
};

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