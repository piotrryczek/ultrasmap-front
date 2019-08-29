import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';

import ScrollbarsWrapper from 'common/scrollbarsWrapper/scrollbarsWrapper.component';

function PageOverlay({ children }) {

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  });

  const handleWindowResize = useCallback(() => {
    setWindowHeight(window.innerHeight);
  }, []);
  
  return (
    <>
      <div className="map-overlay" />
      <div className="page-over-map-wrapper">
        <div className="page-over-map has-scrollbar" id="suggestion">
          <Link to="/" className="page-over-close">
            <CloseIcon color="primary" />
          </Link>
          <ScrollbarsWrapper
            autoHeight
            autoHeightMax={windowHeight - 200}
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
