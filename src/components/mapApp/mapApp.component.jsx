import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _get from 'lodash/get';
import _uniqBy from 'lodash/uniqBy';
import delay from 'delay';

import { setIsLoadingClub, setIsLoadingClubs } from 'components/app/app.actions';
import Api from 'services/api';

import Sidebar from './sidebar/sidebar.component';
import GoogleMapWrapper from './googleMapWrapper/googleMapWrapper.component';

function MapApp(props) {
  const [club, setClub] = useState(null);
  const [clubs, setClubs] = useState([]);

  const dispatch = useDispatch();
  
  const clubIdFromUrl = _get(props, 'match.params.clubId', null);
  const artificialDelay = _get(props, 'location.state.artificialDelay', false);

  useEffect(() => {
    if (clubIdFromUrl) {
      retrieveClub(clubIdFromUrl);
    } else {
      setClub(null);
    }
  }, [clubIdFromUrl]);

  const retrieveClub = useCallback(async(clubId = null) => {
    dispatch(setIsLoadingClub(true));

    const { data: club } = await Api.get(`/clubs/${clubId}`);

    if (artificialDelay) await delay(300); // keyboad hack for mobile device

    dispatch(setIsLoadingClub(false));

    setClub(club);
  }, [artificialDelay]);

  const retrieveClubs = useCallback(async (bounds) => {
    
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

    const finalClubs = _uniqBy([...clubs, ...retrieveClubs], club => club._id);

    setClubs(finalClubs);
    dispatch(setIsLoadingClubs(false));
  }, [clubs]);

  return (
    <div id="map-app">
      <GoogleMapWrapper
        clubs={clubs}
        club={club}
        retrieveClubs={retrieveClubs}
      />
      <Sidebar club={club} />
    </div>
  );
}

export default MapApp;
