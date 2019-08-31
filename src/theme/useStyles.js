import { makeStyles } from '@material-ui/core/styles';

// eslint-disable-next-line import/prefer-default-export
export const useMobileStyles = makeStyles(theme => ({
  buttonBase: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      padding: '6px 12px',
      width: '100%',
      marginBottom: theme.spacing(2),
      borderRadius: '4px !important',
      '&:last-child': {
        marginBottom: '0px',
      },
    },
  },
  groupButton: {
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      width: '100%'
    },
  }
}));
