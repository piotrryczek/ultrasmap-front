import { makeStyles } from '@material-ui/core/styles';

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
      display: 'block !important',
      width: '100%'
    },
  }
}));

export const useButtonIconStyles = makeStyles(theme => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export const useTabStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));