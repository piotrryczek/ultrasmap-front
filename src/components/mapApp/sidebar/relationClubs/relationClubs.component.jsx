import React from 'react';

import { IMAGES_URL } from 'config/config';

function RelationClubs(props) {
  const {
    clubs,
    retrieveClub,
  } = props;

  const handleChangeClub = clubId => () => {
    retrieveClub(clubId);
  }

  return (
    <ul className="relation-clubs">
      {clubs.map(({
        _id: clubId,
        name,
        logo,
      }) => (
        <li key={clubId} className="club">
          <button type="button" onClick={handleChangeClub(clubId)} className="club-link">
            <div className="logo">
              <img src={`${IMAGES_URL}/h180/${logo}`} alt="" />
            </div>
            <h5 className="name">{name}</h5>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RelationClubs;
