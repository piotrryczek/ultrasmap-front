export const parseCoordinates = (coordinates) => {
  return coordinates.reduce((acc, el, index) => {
    const property = index === 0 ? 'lat' : 'lng';
    acc[property] = el;

    return acc;
  }, {})
};