import React from 'react';

import { IMAGES_URL } from 'config/config';

function RelationClubs(props) {
  const {
    clubs,
    goTo,
  } = props;

  const handleChangeClub = clubId => () => {
    goTo(clubId);
  }

  return (
    <ul className="relation-clubs">
      {clubs.map(({
        _id: clubId,
        name,
        transliterationName,
        logo,
      }) => (
        <li key={clubId} className="club">
          <button type="button" onClick={handleChangeClub(clubId)} className="club-link">
            <div className="logo">
              <img src={`${IMAGES_URL}/h180/${logo}`} alt="" />
            </div>
            <h5 className="name">
              <span className="original">{name}</span>
              <span className="transliteration">{transliterationName}</span>
            </h5>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RelationClubs;
