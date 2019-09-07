import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _get from 'lodash/get';
import _uniqBy from 'lodash/uniqBy';
import delay from 'delay';

import { setIsLoadingClub, setIsLoadingClubs, setHoveredClubId } from 'components/app/app.actions';
import { getAllClubsFromClub, sortByTier, enhanceCoordinates } from 'util/helpers';
import Api from 'services/api';

import Sidebar from './sidebar/sidebar.component';
import GoogleMapWrapper from './googleMapWrapper/googleMapWrapper.component';

function MapApp(props) {
  const [state, setState] = useState({
    googleMapDrawer: null,
    club: null,
    clubs: [],
    visibleClubs: [],
  });

  const {
    googleMapDrawer,
    club,
    clubs,
    visibleClubs,
  } = state;

  const dispatch = useDispatch();
  
  const clubIdFromUrl = _get(props, 'match.params.clubId', null);
  const artificialDelay = _get(props, 'location.state.artificialDelay', false);

  useEffect(() => {
    if (clubIdFromUrl) {
      retrieveClub(clubIdFromUrl);
    } else {
      setState((prevState) => ({
        ...prevState,
        club: null,
        visibleClubs: [],
      }));

      dispatch(setHoveredClubId(null));
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

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const geo = {
      northWest: [southWest.lng(), northEast.lat()],
      southWest: [southWest.lng(), southWest.lat()],
      northEast: [northEast.lng(), northEast.lat()],
      southEast: [northEast.lng(), southWest.lat()],
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
    }));

    dispatch(setIsLoadingClubs(false));
  }, [clubs, googleMapDrawer]);


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
