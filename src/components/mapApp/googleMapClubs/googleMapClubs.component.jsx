import React, { useRef, useCallback, memo } from 'react';
import { GoogleMap, Marker, OverlayView, Polyline, withGoogleMap } from 'react-google-maps';
import classNames from 'classnames';
import getDistance from 'geolib/es/getDistance';

import { parseCoordinates } from 'util/helpers';
import { IMAGES_URL, MAP_BOUND_MAXIMUM } from 'config/config';

const getRelationColor = relationType => {
  switch (relationType) {
    case 'friendship':
      return '#248232';

    case 'agreement':
      return '#0E79B2';

    case 'positive':
      return '#80DED9';

    case 'satellite':
    case 'satelliteOf':
      return '#420039';

    default:
      break;
  }
};

const enhanceRelations = (clubs, relation) => clubs.map(club => ({
  ...club,
  relationType: relation,
  latLng: parseCoordinates(club.location.coordinates)
}));

const getAllClubs = club => {
  const {
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
  } = club;

  Object.assign(club, {
    latLng: parseCoordinates(club.location.coordinates),
  });

  const relations = [
    club,
    ...enhanceRelations(friendships, 'friendship'),
    ...enhanceRelations(agreements, 'agreement'),
    ...enhanceRelations(positives, 'positive'),
    ...enhanceRelations(satellites, 'satellite')
  ];

  if (satelliteOf) {
    Object.assign(satelliteOf, {
      relationType: 'satelliteOf',
      latLng: parseCoordinates(satelliteOf.location.coordinates)
    });
    relations.push(satelliteOf);
  }

  return relations;
}

function GoogleMapClubs(props) {
  const mapRef = useRef(null);
  const { club: currentClub, retrieveClub, searchInputRef } = props;

  const allClubs = currentClub ? getAllClubs(currentClub) : [];

  if (allClubs.length) {
    const { current: { context: { __SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: map } } } = mapRef; // It's secure

    let boundsCounter = 0;
    const bounds = new window.google.maps.LatLngBounds();

    for (const club of allClubs) {
      if (getDistance({ latitude: currentClub.latLng.lat, longitude: currentClub.latLng.lng}, { latitude: club.latLng.lat, longitude: club.latLng.lng }) < MAP_BOUND_MAXIMUM) {
        bounds.extend(new window.google.maps.LatLng(club.latLng));
        boundsCounter += 1;
      }
    }

    if (boundsCounter > 1) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(new window.google.maps.LatLng(allClubs[0].latLng)); 
    }
  }

  const clearSearchInputFocus = useCallback(() => {
    searchInputRef.current.blur();
  }, []);

  const handleChangeClub = useCallback(clubId => () => {
    retrieveClub(clubId);
  }, [currentClub]);

  const drawAll = (clubs) => {
    const [enhancedCurrentClub, ...relations] = allClubs;

    return (
      <>
        {clubs.map(club => {
          const {
            _id: clubId,
            latLng,
            name,
            logo,
            relationType,
          } = club;

          return (
            <Marker
              key={clubId}
              defaultPosition={latLng}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 0
              }}
            >
              <OverlayView
                key={clubId}
                position={latLng}
                mapPaneName="overlayMouseTarget"
              >
                <button
                  type="button"
                  className={classNames(
                    {
                      'current-club': clubId === currentClub._id,
                    },
                    'club-marker',
                    relationType
                  )}
                  onClick={handleChangeClub(clubId)}
                >
                  <div className="name">{name}</div>
                  <div className="logo-wrapper">
                    <div className="logo">
                      <img src={`${IMAGES_URL}/h90/${logo}`} alt="" />
                    </div>
                  </div>
                </button>
              </OverlayView>
            </Marker>
          )
        })}
        {relations.map(({
          _id: clubId,
          latLng,
          relationType,
        }) => (
          <Polyline
            key={clubId}
            path={[enhancedCurrentClub.latLng, latLng]}
            options={{
              strokeColor: getRelationColor(relationType),
              strokeOpacity: 0.5,
              strokeWeight: 6,
            }}
          />
        ))}
      </>
    )
  }

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
      {allClubs.length > 0 && drawAll(allClubs)}
    </GoogleMap>
  );
}

export default withGoogleMap(memo(GoogleMapClubs));