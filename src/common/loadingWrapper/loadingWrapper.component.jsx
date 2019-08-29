import React from 'react';
import classNames from 'classnames';

function LoadingWrapper(props) {
  const { isLoading, type, children } = props;

  return (
    <div
      className={classNames('loading-wrapper', `size-${type}`, {
        'loading': isLoading,
      })}
    >
      {children}
    </div>
  );
}

export default LoadingWrapper;
