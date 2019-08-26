/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import history from 'config/history';

function ButtonLink(props) {
  const {
    children,
    to,
    ...rest
  } = props;

  const handleGoTo = useCallback(() => {
    history.push(to);
  }, [to]);

  return (
    <Button
      {...rest}
      onClick={handleGoTo}
    >
      {children}
    </Button>
  );
}

export default ButtonLink;
