import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';

import useWindowHeight from 'hooks/useWindowHeight';
import ScrollbarsWrapper from 'common/scrollbarsWrapper/scrollbarsWrapper.component';

import { toggleSidebar } from 'components/app/app.actions';

function PageOverlay({ children }) {
  const dispatch = useDispatch();
  const windowHeight = useWindowHeight();
  const windowMargin = window.innerWidth > 800 ? 160 : 128;

  const isSidebarOpened = useSelector(state => state.app.isSidebarOpened);

  useEffect(() => {
    if (isSidebarOpened && window.innerWidth < 1400) dispatch(toggleSidebar());
  }, []);
  
  return (
    <>
      <div className="map-overlay" style={{ height: `${windowHeight}px` }} />
      <div className="page-over-map-wrapper" style={{ height: `${windowHeight}px` }}>
        <div className="page-over-map has-scrollbar" id="suggestion">
          <Link to="/" className="page-over-close">
            <CloseIcon color="primary" />
          </Link>
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
