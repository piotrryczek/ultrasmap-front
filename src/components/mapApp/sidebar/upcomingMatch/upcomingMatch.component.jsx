import React from 'react';
import classNames from 'classnames';

import { IMAGES_URL } from 'config/config';

function UpcomingMatch({ currentClub, match, goTo }) {
  const {
    _id: currentClubId,
  } = currentClub;

  const {
    homeClub,
    awayClub,
    unimportantHomeClubName,
    unimportantAwayClubName,
    isHomeClubReserve,
    isAwayClubReserve,
  } = match;

  const isCurrentClubHome = homeClub && homeClub._id === currentClubId;
  const isOtherClubReserve = isCurrentClubHome ? isAwayClubReserve : isHomeClubReserve;

  const otherClub = isCurrentClubHome ? awayClub : homeClub;

  const otherClubLogo = otherClub ? otherClub.logo : null;
  const otherClubBaseName = isCurrentClubHome
    ? awayClub ? awayClub.name : unimportantAwayClubName
    : homeClub ? homeClub.name : unimportantHomeClubName;

  const otherClubFinalName = isOtherClubReserve ? `${otherClubBaseName} ||` : otherClubBaseName;

  const handleChangeClub = () => {
    if (otherClub) goTo(otherClub._id);
  }

  return (
    <button
      className={classNames('match', 'upcoming-match', {
        'has-link': otherClub,
      })}
      type="button"
      onClick={handleChangeClub}
    >
      <div className="logo">
        {otherClubLogo 
          ? <img src={`${IMAGES_URL}/h180/${otherClubLogo}`} alt="" />
          : <span className="no-logo">?</span>}
      </div>
      <h5 className="name">
        <span className="original">{otherClubFinalName}</span>
      </h5>
    </button>
  );
}

export default UpcomingMatch;
