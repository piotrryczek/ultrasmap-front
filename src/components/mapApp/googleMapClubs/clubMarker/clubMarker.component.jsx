import React, { useCallback, memo } from 'react';
import { Marker, OverlayView } from 'react-google-maps'
import classNames from 'classnames';

import { IMAGES_URL } from 'config/config';
import history from 'config/history';

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
});

function ClubMarker(props) {

  const {
    currentClub = null,
    club: {
      _id: clubId,
      latLng,
      name,
      transliterationName,
      logo,
      relationType = 'no-relation',
    }
  } = props;

  const handleChangeClub = useCallback(() => {
    history.push(`/club/${clubId}`)
  }, [currentClub]);

  
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
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={getPixelPositionOffset}
      >
        <button
          type="button"
          className={classNames(
            {
              'current-club': currentClub && clubId === currentClub._id,
            },
            'club-marker',
            relationType
          )}
          onClick={handleChangeClub}
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
  );
}

export default memo(ClubMarker);
