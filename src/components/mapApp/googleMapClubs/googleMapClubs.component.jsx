import React, { useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import { useDebouncedCallback } from 'use-debounce';

import { DEFAULT_ZOOM, DEFAULT_COORDINATES } from 'config/config';
import { setZoom } from 'components/app/app.actions';

import Clubs from './clubs/clubs.component';
import SingleClub from './singleClub/singleClub.component';

function GoogleMapClubs(props) {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const zoom = useSelector(state => state.app.zoom);

  const {
    club: currentClub,
    searchInputRef, retrieveClubs,
    clubs = [],
  } = props;

  useEffect(() => {
    if (!currentClub) handleBoundsChanged();
  }, [currentClub]);

  const clearSearchInputFocus = useCallback(() => {
    searchInputRef.current.blur();
  }, []);

  const [handleBoundsChanged] = useDebouncedCallback(() => {
    const { current: map } = mapRef;

    if (!currentClub && map.getZoom() >= DEFAULT_ZOOM) retrieveClubs(map.getBounds());
  }, 500);

  const handleZoomChange = useCallback(() => {
    const { current: map } = mapRef;
    
    dispatch(setZoom(map.getZoom()));
  }, []);

  return (
    <GoogleMap
      ref={mapRef}
      onDragStart={clearSearchInputFocus}
      onBoundsChanged={handleBoundsChanged}
      onZoomChanged={handleZoomChange}
      defaultZoom={DEFAULT_ZOOM}
      zoom={zoom}
      defaultCenter={{
        lat: DEFAULT_COORDINATES[1],
        lng: DEFAULT_COORDINATES[0],
      }}
      options={{
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          mapTypeIds: []
        },
        gestureHandling: 'greedy',
      }}
    >
      {currentClub && (
        <SingleClub
          forwardRef={mapRef}
          currentClub={currentClub}
        />
      )}
      {!currentClub && clubs.length > 0 && (
        <Clubs
          forwardRef={mapRef}
          clubs={clubs}
        />
      )}
    </GoogleMap>
  );
}

export default withGoogleMap(GoogleMapClubs);
