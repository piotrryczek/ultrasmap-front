import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Auth from 'services/auth';
import _get from 'lodash/get';

function SuggestAddNewClubButton() {
  const { isAuthenticated } = useSelector(state => ({ isAuthenticated: _get(state, 'app.isAuthenticated', false) }));

  const handleLogout = async () => {
    await Auth.logout();
  }

  return isAuthenticated ? (
    <button
      type="button"
      id="login-logout-button"
      className="standard-button button-blue"
      onClick={handleLogout}
    >
      Logout
    </button>
  ): (
    <Link to="/login">
      <button
        type="button"
        id="login-logout-button"
        className="standard-button button-green"
        onClick={handleLogout}
      >
        Login
      </button>
    </Link>
  );
}

export default SuggestAddNewClubButton;
