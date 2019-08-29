import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function SuggestAddNewClubButton() {
  const { t } = useTranslation();

  return (
    <Link to="/suggestion">
      <button
        type="button"
        id="suggest-add-new-club"
        className="standard-button button-green"
      >
        {t('global.suggestNewClub')}
      </button>
    </Link>
  );
}

export default SuggestAddNewClubButton;
