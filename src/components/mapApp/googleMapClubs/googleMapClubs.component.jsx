import React, { useCallback, useEffect, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

import { DEFAULT_ZOOM, DEFAULT_COORDINATES, MAXIMUM_CLUBS_ON_MAP, ABSOLUTE_MAX_ZOOM } from 'config/config';
import { setZoom, setIsTooMuchClubs } from 'components/app/app.actions';

import GoogleMapDrawer from 'services/googleMap/googleMapDrawer';

function GoogleMapClubs(props) {
  const {
    googleMapDrawer,
    setGoogleMapDrawer,
    club: currentClub,
    searchInputRef, retrieveClubs,
    clubs = [],
    refreshClubs,
    windowHeight,
  } = props;

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    zoom,
    isTooMuchClubs,
    hoveredClubId,
  } = useSelector(state => ({
    zoom: state.app.zoom,
    isTooMuchClubs: state.app.isTooMuchClubs,
    hoveredClubId: state.app.hoveredClubId,
  }));

  const tooMuchClubs = clubs.length > MAXIMUM_CLUBS_ON_MAP;
  if (tooMuchClubs !== isTooMuchClubs) dispatch(setIsTooMuchClubs(tooMuchClubs));

  const handleClearSearchInputFocus = useCallback(() => {
    searchInputRef.current.blur();
  }, [searchInputRef]);


  // Debounced callbacks
  const [searchForClubsInArea] = useDebouncedCallback(() => {
    retrieveClubs();
  }, 400);

  const [handleRefreshClubs] = useDebouncedCallback(() => {
    refreshClubs();
  }, 100);


  // Unified method for getting clubs
  const getClubs = () => {
    const zoom = googleMapDrawer.map.getZoom();

    if (!currentClub && zoom >= ABSOLUTE_MAX_ZOOM) {
      if (!tooMuchClubs) handleRefreshClubs();
      searchForClubsInArea();
    }
  }


  // Main Callbacks for Google Map map
  const handleBoundsChanged = useCallback(() => {
    if (isLoaded) getClubs();
  }, [isLoaded, currentClub, tooMuchClubs, clubs, googleMapDrawer]);  

  const handleZoomChanged = useCallback((newZoom) => {
    dispatch(setZoom(newZoom));
  }, []);

  const handleMapLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);


  // Use when coming back from SingleClub to Browsing Clubs mode
  useEffect(() => {
    if (isLoaded) getClubs();
  }, [isLoaded, currentClub]);


  // Initialization
  useEffect(() => {
    const googleMapDrawer = new GoogleMapDrawer(
      {
        initialCenter: { lat: DEFAULT_COORDINATES[1], lng: DEFAULT_COORDINATES[0] },
        initialZoom: DEFAULT_ZOOM,
      },
      {
        boundsChangedCallback: handleBoundsChanged,
        zoomChangedCallback: handleZoomChanged,
        mapLoadedCallback: handleMapLoaded,
        clearSearchInputFocusCallback: handleClearSearchInputFocus,
      }
    );

    setGoogleMapDrawer(googleMapDrawer);
  }, []);


  // Google Maps Clubs logic (updating googleMapDrawer)
  useEffect(() => { // Clubs
    if (isLoaded && !currentClub && !tooMuchClubs) {
      googleMapDrawer.updateClubs(clubs);
    }
  }, [isLoaded, currentClub, clubs, tooMuchClubs]);

  useEffect(() => { // SingleClub
    if (isLoaded && currentClub) {
      googleMapDrawer.updateCurrentClub(currentClub);
    }
  }, [isLoaded, currentClub]);

  useEffect(() => { // Hover
    if (isLoaded) googleMapDrawer.setHovered(hoveredClubId);
  }, [isLoaded, hoveredClubId]);

  useEffect(() => { // Too much clubs
    if (isLoaded) googleMapDrawer.setTooMuchClubs(tooMuchClubs);
  }, [isLoaded, tooMuchClubs])


  // Update callbacks
  useEffect(() => {
    if (googleMapDrawer) googleMapDrawer.setCallback('zoomChangedCallback', handleZoomChanged);
  }, [handleZoomChanged]);

  useEffect(() => {
    if (googleMapDrawer) googleMapDrawer.setCallback('boundsChangedCallback', handleBoundsChanged);
  }, [currentClub, zoom, tooMuchClubs, clubs]); // zoom?

  useEffect(() => {
    if (googleMapDrawer) googleMapDrawer.setCallback('clearSearchInputFocusCallback', handleClearSearchInputFocus);
  }, [handleClearSearchInputFocus]);
  

  return (
    <div
      id="google-map-clubs"
      role="presentation"
      style={{ height: `${windowHeight}px`}}
    />
  );
}

export default memo(GoogleMapClubs);