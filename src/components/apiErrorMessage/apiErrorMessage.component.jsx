import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import { clearMessage } from 'components/app/app.actions';

const useStyles = makeStyles(theme => ({
  dialogActions: {
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
  },
}));

function ApiErrorMessage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles({});

  const messageCode = useSelector(state => state.app.messageCode);

  const handleCloseDialog = useCallback(() => {
    dispatch(clearMessage())
  }, []);

  if (!messageCode) return (<></>);

  return (
    <Dialog
      open
      onClose={handleCloseDialog}
    >
      <DialogTitle>
        {t('global.serverProblem')}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t(`messageCodes.${messageCode}`)}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={handleCloseDialog}
          variant="contained"
          color="primary"
          size="large"
        >
          {t('global.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiErrorMessage;
