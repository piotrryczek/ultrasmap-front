import React from 'react';

import RelationClub from './relationClub.component';

function RelationClubs(props) {
  const {
    clubs,
    goTo,
    setHoveredClub,
  } = props;

  return (
    <ul className="relation-clubs">
      {clubs.map(club => (
        <li key={club._id} className="club">
          <RelationClub
            club={club}
            setHoveredClub={setHoveredClub}
            goTo={goTo}
          />
        </li>
      ))}
    </ul>
  );
}

export default RelationClubs;
