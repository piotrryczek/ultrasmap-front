import React, { useCallback } from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';

function GoogleMapLocation(props) {
  const {
    markerCoordination,
    setFieldValue,
  } = props;

  const handleDragEnd = useCallback((event) => {
    const { latLng: { lat, lng } } = event;

    setFieldValue('coordinates', [lng(), lat()]);
  }, []);

  return (
    <GoogleMap
      defaultZoom={8}
      center={markerCoordination}
      options={{
        scrollwheel: false,
      }}
    >
      <Marker
        position={markerCoordination}
        draggable
        onDragEnd={handleDragEnd}
      />
    </GoogleMap>
  );
}

export default withGoogleMap((GoogleMapLocation));
