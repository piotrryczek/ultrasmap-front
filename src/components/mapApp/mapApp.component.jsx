import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _get from 'lodash/get';
import delay from 'delay';

import { setIsLoadingClub } from 'components/app/app.actions';
import Api from 'services/api';

import Sidebar from './sidebar/sidebar.component';
import GoogleMapWrapper from './googleMapWrapper/googleMapWrapper.component';

function MapApp(props) {
  const [club, setClub] = useState(null);
  const dispatch = useDispatch();
  
  const clubIdFromUrl = _get(props, 'match.params.clubId', null);
  const artificialDelay = _get(props, 'location.state.artificialDelay', false)

  useEffect(() => {
    if (clubIdFromUrl) retrieveClub(clubIdFromUrl);
  }, [clubIdFromUrl]);

  const retrieveClub = useCallback(async(clubId = null) => {
    dispatch(setIsLoadingClub(true));

    const { data: club } = await Api.get(`/clubs/${clubId}`);

    if (artificialDelay) await delay(300); // keyboad hack for mobile device

    dispatch(setIsLoadingClub(false));

    setClub(club);
  }, [artificialDelay]);

  return (
    <div id="map-app">
      <GoogleMapWrapper club={club} />
      <Sidebar club={club} />
    </div>
  );
}

export default MapApp;
