/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

function ScrollbarsWrapper({ children, ...props}) {

  const trackV = useCallback(({ style, ...props }) => (
    <div className="track track-vertical" style={style} {...props} />
  ), []);

  const thumbV = useCallback(({ style, ...props }) => (
    <div className="thumb thumb-vertical" style={{ ...style }} {...props} />
  ), []);

  return (
    <Scrollbars
      {...props}
      renderThumbVertical={thumbV}
      renderTrackVertical={trackV}
    >
      {children}
    </Scrollbars>
  );
}

export default ScrollbarsWrapper;
