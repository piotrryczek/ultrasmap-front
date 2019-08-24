import React, { useCallback, useState } from 'react';

import Api from 'services/api';

import Sidebar from './sidebar/sidebar.component';
import GoogleMap from './googleMap/googleMap.component';

function MapApp() {
  const [club, setClub] = useState(null);

  const retrieveClub = useCallback(async(clubId) => {
    const { data: club } = await Api.get(`/clubs/${clubId}`);

    setClub(club);
  }, []);

  return (
    <div id="map-app">
      <GoogleMap club={club} retrieveClub={retrieveClub} />
      <Sidebar club={club} retrieveClub={retrieveClub} />
    </div>
    
  );
}

export default MapApp;
