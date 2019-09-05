import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { DEFAULT_ZOOM } from 'config/config';

function ClubsStatus(props) {
  const { currentClub } = props;
  const { t } = useTranslation();

  const {
    isLoadingClubs,
    isLoadingClub,
    zoom,
  } = useSelector(state => ({
    isLoadingClubs: state.app.isLoadingClubs,
    isLoadingClub: state.app.isLoadingClub,
    zoom: state.app.zoom,
  }));

  return (
    <>
      <p
        id="clubs-status-information"
        className={classNames('clubs-status', { show: !isLoadingClub && !isLoadingClubs && !currentClub && zoom < DEFAULT_ZOOM })}
      >
        {t('global.zoomIn')}
      </p>
      <div
        id="clubs-status-loading"
        className={classNames('clubs-status', { show: !currentClub && isLoadingClubs })}
      />
    </>
  );
}

export default memo(ClubsStatus);
