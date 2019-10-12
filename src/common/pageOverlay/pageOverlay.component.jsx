import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import CloseIcon from '@material-ui/icons/Close';

import useWindowHeight from 'hooks/useWindowHeight';
import ScrollbarsWrapper from 'common/scrollbarsWrapper/scrollbarsWrapper.component';

import { hideSidebar, setIsLoadingClubsDisabled } from 'components/app/app.actions';

function PageOverlay(props) {
  const {
    children,
    clearClubs,
    handleClose,
  } = props;

  const dispatch = useDispatch();
  const windowHeight = useWindowHeight();
  const windowMargin = window.innerWidth > 800 ? 160 : 128;

  const initCallback = useCallback(async () => {
    await dispatch(setIsLoadingClubsDisabled(true));
    dispatch(hideSidebar());
    clearClubs();
  }, []);

  useEffect(() => {
    initCallback();
  }, []);
  
  return (
    <>
      <div className="map-overlay" style={{ height: `${windowHeight}px` }} />
      <div className="page-over-map-wrapper" style={{ height: `${windowHeight}px` }}>
        <div className="page-over-map has-scrollbar" id="suggestion">
          <button
            type="button"
            className="page-over-close"
            onClick={handleClose}
          >
            <CloseIcon color="primary" />
          </button>
          <ScrollbarsWrapper
            autoHeight
            autoHeightMax={windowHeight - windowMargin}
          >
            <div className="inner">
              {children}
            </div>
          </ScrollbarsWrapper>
        </div>
      </div>
    </>
  );
}

export default PageOverlay;
