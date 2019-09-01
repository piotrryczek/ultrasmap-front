import React, { useCallback, useState } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

function TooltipWrapper(props) {
  const { children, ...rest } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleTooltipClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleTooltipOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        {...rest}
        onClose={handleTooltipClose}
        open={isOpen}
        onClick={handleTooltipOpen}
        onMouseEnter={handleTooltipOpen}
        leaveTouchDelay={5000}
      >
        {children}
      </Tooltip>
    </ClickAwayListener>
  );
}



export default TooltipWrapper;
