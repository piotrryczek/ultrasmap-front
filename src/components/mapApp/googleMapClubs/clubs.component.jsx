import React, { memo, useCallback } from 'react';
import { Marker, OverlayView, Polyline } from 'react-google-maps';
import classNames from 'classnames';
import getDistance from 'geolib/es/getDistance';

import history from 'config/history';
import { IMAGES_URL } from 'config/config';
import { getMaximumDistance, parseCoordinates } from 'util/helpers';

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

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
});

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

function Clubs(props) {
  const {
    currentClub,
    forwardRef: mapRef,
  } = props;

  const handleChangeClub = useCallback(clubId => () => {
    history.push(`/club/${clubId}`)
  }, [currentClub]);

  const allClubs = currentClub ? getAllClubs(currentClub) : [];

  const [enhancedCurrentClub, ...relations] = allClubs;

  if (allClubs.length) {
    const maximumDistance = getMaximumDistance(currentClub, allClubs);
    const { current: { context: { __SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: map } } } = mapRef; // It's secure

    let boundsCounter = 0;
    const bounds = new window.google.maps.LatLngBounds();

    for (const club of allClubs) {
      if (getDistance({ latitude: currentClub.latLng.lat, longitude: currentClub.latLng.lng}, { latitude: club.latLng.lat, longitude: club.latLng.lng }) < maximumDistance) {
        bounds.extend(new window.google.maps.LatLng(club.latLng));
        boundsCounter += 1;
      }
    }

    if (boundsCounter > 1) {
      map.fitBounds(bounds, {
        top: 90,
        bottom: 35,
        left: 35,
        right: 35,
      });
    } else {
      map.setCenter(new window.google.maps.LatLng(allClubs[0].latLng)); 
    }
  }

  return (
    <>
      {allClubs.map(club => {
        const {
          _id: clubId,
          latLng,
          name,
          transliterationName,
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
              getPixelPositionOffset={getPixelPositionOffset}
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
                <div className="name">
                  <span className="original">{name}</span>
                  {transliterationName && (<span className="transliteration">{transliterationName}</span>)}
                </div>
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

export default memo(Clubs);
