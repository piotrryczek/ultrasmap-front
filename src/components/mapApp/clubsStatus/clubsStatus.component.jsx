import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { ABSOLUTE_MAX_ZOOM } from 'config/config';

function ClubsStatus(props) {
  const { currentClub } = props;
  const { t } = useTranslation();

  const {
    isLoadingClubs,
    isLoadingClub,
    zoom,
    isTooMuchClubs,
  } = useSelector(state => ({
    isLoadingClubs: state.app.isLoadingClubs,
    isLoadingClub: state.app.isLoadingClub,
    zoom: state.app.zoom,
    isTooMuchClubs: state.app.isTooMuchClubs,
  }));

  return (
    <>
      <div
        id="clubs-status-information"
        className={classNames('clubs-status', { show: !isLoadingClub && !currentClub && (isTooMuchClubs || zoom < ABSOLUTE_MAX_ZOOM) })}
      >
        <p>{zoom < ABSOLUTE_MAX_ZOOM ? t('global.zoomMax') : t('global.zoomIn')}</p>
      </div>
      <div
        id="clubs-status-loading"
        className={classNames('clubs-status', { show: !currentClub && isLoadingClubs })}
      />
    </>
  );
}

export default memo(ClubsStatus);
