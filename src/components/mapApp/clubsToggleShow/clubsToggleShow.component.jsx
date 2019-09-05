import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import Tooltip from '@material-ui/core/Tooltip';

import history from 'config/history';

function ClubsToggleShow(props) {
  const { t } = useTranslation();

  const { currentClub } = props;

  const handleReset = useCallback(() => {
    history.push('/');
  }, []);

  return (
    <Tooltip placement="right" title={t('global.backToViewingClubs')}>
      <button
        id="clubs-toggle-show"
        type="button"
        onClick={handleReset}
        className={classNames({
          'show': currentClub,
        })}
      >
        <LocationSearchingIcon />
      </button>
    </Tooltip>
  );
}

export default memo(ClubsToggleShow);
