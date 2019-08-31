import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0E79B2',
    },
    secondary: {
      main: '#248232',
    },
    error: {
      main: '#ED254E',
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
        fontWeight: 'normal',
        padding: '0.5rem 1rem',
      },
    }
  },
});

export default theme;