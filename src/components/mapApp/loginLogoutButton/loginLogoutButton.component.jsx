import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Auth from 'services/auth';

function SuggestAddNewClubButton() {
  const { t } = useTranslation();
  const isAuthenticated = useSelector(state => state.app.isAuthenticated);

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
      {t('global.logout')}
    </button>
  ): (
    <Link to="/login">
      <button
        type="button"
        id="login-logout-button"
        className="standard-button button-green"
        onClick={handleLogout}
      >
        {t('global.login')}
      </button>
    </Link>
  );
}

export default SuggestAddNewClubButton;
