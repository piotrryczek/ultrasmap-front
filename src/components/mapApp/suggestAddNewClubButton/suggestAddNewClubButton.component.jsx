import React from 'react';
import { Link } from 'react-router-dom';

function SuggestAddNewClubButton() {

  return (
    <Link to="/suggestion">
      <button
        type="button"
        id="suggest-add-new-club"
        className="standard-button button-green"
      >
        Suggest new club
      </button>
    </Link>
  );
}

export default SuggestAddNewClubButton;
