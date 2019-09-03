import React, { useRef, useCallback } from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';

import Clubs from './clubs.component';

function GoogleMapClubs(props) {
  const mapRef = useRef(null);
  const { club: currentClub, searchInputRef } = props;

  const clearSearchInputFocus = useCallback(() => {
    searchInputRef.current.blur();
  }, []);
  
  return (
    <GoogleMap
      ref={mapRef}
      onDragStart={clearSearchInputFocus}
      defaultZoom={8}
      defaultCenter={{
        lat: 51.5017725,
        lng: 20.4335716,
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
      <Clubs
        forwardRef={mapRef}
        currentClub={currentClub}
      />
    </GoogleMap>
  );
}

export default withGoogleMap(GoogleMapClubs);
