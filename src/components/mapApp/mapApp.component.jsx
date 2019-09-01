import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setIsLoadingClub } from 'components/app/app.actions';
import Api from 'services/api';

import Sidebar from './sidebar/sidebar.component';
import GoogleMapWrapper from './googleMapWrapper/googleMapWrapper.component';

function MapApp() {
  const [club, setClub] = useState(null);
  const dispatch = useDispatch();

  const retrieveClub = useCallback(async(clubId = null) => {
    dispatch(setIsLoadingClub(true));

    const apiUrlEnding = clubId || 'random';

    const { data: club } = await Api.get(`/clubs/${apiUrlEnding}`);

    dispatch(setIsLoadingClub(false));

    setClub(club);
  }, []);

  return (
    <div id="map-app">
      <GoogleMapWrapper club={club} retrieveClub={retrieveClub} />
      <Sidebar club={club} retrieveClub={retrieveClub} />
    </div>
  );
}

export default MapApp;
