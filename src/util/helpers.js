export const parseCoordinates = (coordinates) => {
  return coordinates.reduce((acc, el, index) => {
    const property = index === 0 ? 'lng' : 'lat';
    acc[property] = el;

    return acc;
  }, {})
};

export const getAllClubsFromClub = (club) => {
  const {
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
  } = club;

  const clubs = [club, ...friendships, ...agreements, ...positives, ...satellites];
  if (satelliteOf) clubs.push(satelliteOf);

  return clubs;
}

export const enhanceCoordinates = clubs => clubs.map(club => Object.assign(club, { latLng: parseCoordinates(club.location.coordinates) }));

export const sortByTier = (clubA, clubB) => clubA.tier < clubB.tier ? 1 : -1;