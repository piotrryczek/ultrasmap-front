import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { isMobile, isTablet } from 'react-device-detect';

import { IMAGES_URL } from 'config/config';
import { setHoveredClubId } from 'components/app/app.actions';

function RelationClub({ club, goTo }) {
  const dispatch = useDispatch();

  const {
    _id: clubId,
    name,
    logo,
    transliterationName,
    // tier,
  } = club;

  const handleChangeClub = () => {
    goTo(clubId);
  }

  const handleMouseEnter = () => {
    dispatch(setHoveredClubId(clubId));
  }

  const handleMouseLeave = () => {
    dispatch(setHoveredClubId(null));
  }

  return (
    <button
      type="button"
      onClick={handleChangeClub}
      className="club-link"
      onMouseEnter={(!isMobile && !isTablet) ? handleMouseEnter : null}
      onMouseLeave={(!isMobile && !isTablet) ? handleMouseLeave : null}
    >
      <div className="logo">
        <img src={`${IMAGES_URL}/h180/${logo}`} alt="" />
      </div>
      <h5 className="name">
        <span className="original">{name}</span>
        {transliterationName && <span className="transliteration">{transliterationName}</span>}
      </h5>
      {/* <div className="tier">
        {tier}
      </div> */}
    </button>
  );
}

export default memo(RelationClub);
