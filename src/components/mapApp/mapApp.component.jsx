/* global google */
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _get from 'lodash/get';
import _uniqBy from 'lodash/uniqBy';
import delay from 'delay';

import { setIsLoadingClub, setIsLoadingClubs, setHoveredClubId, hideSidebar } from 'components/app/app.actions';
import { getAllClubsFromClub, sortByTier, enhanceCoordinates, checkIfYetSearched, mergePolygons } from 'util/helpers';
import Api from 'services/api';

import Sidebar from './sidebar/sidebar.component';
import GoogleMapWrapper from './googleMapWrapper/googleMapWrapper.component';

function MapApp(props) {
  const [state, setState] = useState({
    googleMapDrawer: null,
    club: null,
    clubs: [],
    visibleClubs: [],
    yetSearchedPolygon: null,
  });

  const {
    googleMapDrawer,
    club,
    clubs,
    visibleClubs,
    yetSearchedPolygon,
  } = state;

  const dispatch = useDispatch();
  
  const clubIdFromUrl = _get(props, 'match.params.clubId', null);
  const artificialDelay = _get(props, 'location.state.artificialDelay', false);
  
  useEffect(() => {
    if (clubIdFromUrl) {
      retrieveClub(clubIdFromUrl);
    } else {
      const shouldHideSidebar = _get(props, 'location.state.hideSidebar', false);

      setState((prevState) => ({
        ...prevState,
        club: null,
        visibleClubs: [],
      }));

      dispatch(setHoveredClubId(null));

      if (shouldHideSidebar) dispatch(hideSidebar());
    }
  }, [clubIdFromUrl]);

  const setGoogleMapDrawer = useCallback((googleMapDrawer) => {
    setState((prevState) => ({
      ...prevState,
      googleMapDrawer,
    }));
  }, []);

  const refreshClubs = useCallback(() => {
    const bounds = googleMapDrawer.map.getBounds();

    const visibleClubs = getVisibleClubs(clubs, bounds);
    
    visibleClubs.sort(sortByTier);

    setState((prevState) => ({
      ...prevState,
      visibleClubs,
    })); // Caching clubs, when moving we want to check if clubs were cached and are in the view so we push re-render
  }, [clubs, googleMapDrawer]);


  const retrieveClub = useCallback(async(clubId = null) => {
    dispatch(setIsLoadingClub(true));

    const { data: club } = await Api.get(`/clubs/${clubId}`);

    if (artificialDelay) await delay(300); // keyboad hack for mobile device

    dispatch(setIsLoadingClub(false));

    const allClubs = enhanceCoordinates(_uniqBy([...clubs, ...getAllClubsFromClub(club)], club => club._id));

    allClubs.sort(sortByTier);

    setState((prevState) => ({
      ...prevState,
      club,
      clubs: allClubs,
    }));
  }, [artificialDelay, clubs]);

  const retrieveClubs = useCallback(async () => {
    const bounds = googleMapDrawer.map.getBounds();

    const northEastBounds = bounds.getNorthEast();
    const southWestBounds = bounds.getSouthWest();

    if (checkIfYetSearched(yetSearchedPolygon, bounds)) return false;

    const currentPolygon = new google.maps.Polygon({
      paths: [
        { lat: northEastBounds.lat(), lng: northEastBounds.lng() }, // North East (top right)
        { lat: southWestBounds.lat(), lng: northEastBounds.lng() }, // South East (bottom right)
        { lat: southWestBounds.lat(), lng: southWestBounds.lng() }, // South West (bottom left)
        { lat: northEastBounds.lat(), lng: southWestBounds.lng() }, // North West (top left)
        { lat: northEastBounds.lat(), lng: northEastBounds.lng() } // North East (top right)
      ]
    });

    const newSearchedPolygon = yetSearchedPolygon
      ? mergePolygons(currentPolygon, yetSearchedPolygon)
      : currentPolygon;

    const geo = {
      northWest: [southWestBounds.lng(), northEastBounds.lat()],
      southWest: [southWestBounds.lng(), southWestBounds.lat()],
      northEast: [northEastBounds.lng(), northEastBounds.lat()],
      southEast: [northEastBounds.lng(), southWestBounds.lat()],
    };

    dispatch(setIsLoadingClubs(true));

    const { data: retrieveClubs } = await Api.get('/clubs/geo', geo);

    const finalClubs = _uniqBy([...clubs, ...enhanceCoordinates(retrieveClubs)], club => club._id);

    const visibleClubs = getVisibleClubs(finalClubs, bounds)
    visibleClubs.sort(sortByTier);

    setState((prevState) => ({
      ...prevState,
      clubs: finalClubs,
      visibleClubs,
      yetSearchedPolygon: newSearchedPolygon,
    }));

    dispatch(setIsLoadingClubs(false));
  }, [clubs, googleMapDrawer, yetSearchedPolygon]);


  const getVisibleClubs = (clubsToCheck, bounds) => {
    return clubsToCheck.filter(club => bounds.contains(club.latLng));
  }

  return (
    <div id="map-app">
      <GoogleMapWrapper
        clubs={visibleClubs}
        club={club}
        retrieveClubs={retrieveClubs}
        refreshClubs={refreshClubs}
        setGoogleMapDrawer={setGoogleMapDrawer}
        googleMapDrawer={googleMapDrawer}
      />
      <Sidebar
        club={club}
        clubs={visibleClubs}
      />
    </div>
  );
}

export default MapApp;
