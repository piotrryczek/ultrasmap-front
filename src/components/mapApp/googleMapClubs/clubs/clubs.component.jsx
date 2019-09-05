import React, { memo } from 'react';
import { useSelector } from 'react-redux';

import { DEFAULT_ZOOM } from 'config/config';
import { parseCoordinates } from 'util/helpers';
import ClubMarker from 'components/mapApp/googleMapClubs/clubMarker/clubMarker.component';

function Clubs(props) {
  const {
    forwardRef: mapRef,
    clubs = [],
  } = props;

  const zoom = useSelector(state => state.app.zoom);

  const { current: { context: { __SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: map } } } = mapRef; // it is safe

  const bounds = map.getBounds();

  const enhancedClubs = clubs.map(club => Object.assign(club, { latLng: parseCoordinates(club.location.coordinates) }))

  if (zoom < DEFAULT_ZOOM) return (null);

  return enhancedClubs.map(club => bounds.contains(club.latLng) && <ClubMarker key={club._id} club={club} />)
}

export default memo(Clubs);