/* global google */
import * as jsts from 'jsts';

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

export const checkIfYetSearched = (polygon, bounds) => {
  if (!polygon) return false;

  const northEastBounds = bounds.getNorthEast();
  const southWestBounds = bounds.getSouthWest();

  const northEastLatLng = new google.maps.LatLng(northEastBounds.lat(), northEastBounds.lng());
  const northWestLatLng = new google.maps.LatLng(northEastBounds.lat(), southWestBounds.lng());
  const southEastLatLng = new google.maps.LatLng(southWestBounds.lat(), northEastBounds.lng());
  const southWestLatLng = new google.maps.LatLng(southWestBounds.lat(), southWestBounds.lng());

  return google.maps.geometry.poly.containsLocation(northEastLatLng, polygon)
  && google.maps.geometry.poly.containsLocation(northWestLatLng, polygon)
  && google.maps.geometry.poly.containsLocation(southEastLatLng, polygon)
  && google.maps.geometry.poly.containsLocation(southWestLatLng, polygon);
}

const googleMaps2JSTS = (boundaries) => {
  const coordinates = [];
  for (var i = 0; i < boundaries.getLength(); i++) {
    coordinates.push(new jsts.geom.Coordinate(
      boundaries.getAt(i).lat(), boundaries.getAt(i).lng()));
  }
  return coordinates;
};

const jsts2googleMaps = (geometry) => {
  const coordArray = geometry.getCoordinates();
  const GMcoords = [];
  for (var i = 0; i < coordArray.length; i++) {
    GMcoords.push(new google.maps.LatLng(coordArray[i].x, coordArray[i].y));
  }

  return GMcoords;
}

export const mergePolygons = (polygonA, polygonB) => {
  const precisionModel = new jsts.geom.PrecisionModel(jsts.geom.PrecisionModel.FLOATING);
  const geometryFactory = new jsts.geom.GeometryFactory(precisionModel);

  const jstsPolygonA = geometryFactory.createPolygon(geometryFactory.createLinearRing(googleMaps2JSTS(polygonA.getPath())));
  jstsPolygonA.normalize();
  const jstsPolygonB = geometryFactory.createPolygon(geometryFactory.createLinearRing(googleMaps2JSTS(polygonB.getPath())));
  jstsPolygonB.normalize();

  const jstsMergedPolygon = jstsPolygonA.union(jstsPolygonB);
  const mergedPath = jsts2googleMaps(jstsMergedPolygon);

  const mergedPolygon = new google.maps.Polygon({
    paths: mergedPath,
  });

  return mergedPolygon;
}