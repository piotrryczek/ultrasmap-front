import React from 'react';
import Auth from 'services/auth';

function SuggestAddNewClubButton() {
  const handleLogout = async () => {
    await Auth.logout();
  }

  return (
    <button
      type="button"
      id="logout-button"
      className="standard-button button-blue"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default SuggestAddNewClubButton;
