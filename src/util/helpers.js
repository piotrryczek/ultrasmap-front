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

export const checkIfYetSearched = (polygons, bounds) => {
  if (!polygons.length) return false;

  const northEastBounds = bounds.getNorthEast();
  const southWestBounds = bounds.getSouthWest();

  const northEastLatLng = new google.maps.LatLng(northEastBounds.lat(), northEastBounds.lng());
  const northWestLatLng = new google.maps.LatLng(northEastBounds.lat(), southWestBounds.lng());
  const southEastLatLng = new google.maps.LatLng(southWestBounds.lat(), northEastBounds.lng());
  const southWestLatLng = new google.maps.LatLng(southWestBounds.lat(), southWestBounds.lng());

  return polygons.some((polygon) => google.maps.geometry.poly.containsLocation(northEastLatLng, polygon)
  && google.maps.geometry.poly.containsLocation(northWestLatLng, polygon)
  && google.maps.geometry.poly.containsLocation(southEastLatLng, polygon)
  && google.maps.geometry.poly.containsLocation(southWestLatLng, polygon));
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

const recursiveMergePolygons = (polygons) => {
  if (polygons.length === 1) return polygons;

  const firstPolygon = polygons.shift();

  let hasIntersect = false;
  const newPolygons =  polygons.reduce((acc, polygon, index, arr) => {
    if (firstPolygon.intersects(polygon)) { // If polygons are intersecting each other merge them and repeat same process but without currently merged polygon
      const mergedPolygon = firstPolygon.union(polygon);
      acc = recursiveMergePolygons([mergedPolygon, ...polygons.filter((_, polIndex) => polIndex !== index)]);
      hasIntersect = true;
      arr.splice(1); // Breaking reduce loop
    } else { // Simply adding to array same polygon
      acc.push(polygon);
    }
    return acc;
  }, []);

  return hasIntersect ? newPolygons : [firstPolygon, ...newPolygons];
};

export const mergePolygons = (boundsPolygon, otherPolygons) => {
  const precisionModel = new jsts.geom.PrecisionModel(jsts.geom.PrecisionModel.FLOATING);
  const geometryFactory = new jsts.geom.GeometryFactory(precisionModel);

  // @ts-ignore
  const jstsBoundsPolygon = geometryFactory.createPolygon(geometryFactory.createLinearRing(googleMaps2JSTS(boundsPolygon.getPath())));
  jstsBoundsPolygon.normalize();
  const jstsPolygons = otherPolygons.map(polygon => {
    // @ts-ignore
    const jstsPolygon = geometryFactory.createPolygon(geometryFactory.createLinearRing(googleMaps2JSTS(polygon.getPath())));
    jstsPolygon.normalize();

    return jstsPolygon;
  });

  const jstsFinalPolygons = recursiveMergePolygons([jstsBoundsPolygon, ...jstsPolygons]);

  return jstsFinalPolygons.map((jstsPolygon) => {
    const path = jsts2googleMaps(jstsPolygon);
    
    return new google.maps.Polygon({
      paths: path,
    });
  });
}

export const getClubsSizes = (zoom) => {
  switch (zoom) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      return {
        ['tier5']: 's',
        ['tier4']: 'xs'
      };
    }

    case 7: {
      return {
        ['tier5']: 'm',
        ['tier4']: 's',
        ['tier3']: 'xs',
      };
    }

    case 8: {
      return {
        ['tier5']: 'l',
        ['tier4']: 'm',
        ['tier3']: 's',
        ['tier2']: 'xs',
      };
    }

    case 9: {
      return {
        ['tier5']: 'xl',
        ['tier4']: 'l',
        ['tier3']: 'm',
        ['tier2']: 's',
        ['tier1']: 'xs',
        ['tier0']: 'xs',
      };
    }

    case 10: {
      return {
        ['tier5']: 'xl',
        ['tier4']: 'l',
        ['tier3']: 'm',
        ['tier2']: 's',
        ['tier1']: 's',
        ['tier0']: 's',
      };
    }

    case 11:
    default: {
      return {
        ['tier5']: 'xl',
        ['tier4']: 'l',
        ['tier3']: 'm',
        ['tier2']: 'm',
        ['tier1']: 's',
        ['tier0']: 's',
      };
    }
    
  }
};

export const getRoundedTier = (tier) => {
  const roundedTier = Math.round(tier);

  return roundedTier < 1 ? 1 : roundedTier;
};

export const getRoundedTierForLabel = (tier) => {
  if (tier < 0.2) return 0;
  if (tier < 0.5) return 1;
  
  return Math.round(tier);
};
