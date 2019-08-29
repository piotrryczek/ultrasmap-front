import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import ButtonLink from 'common/buttonLink/buttonLink.component';

function NeedToBeLoggedIn(props) {
  const { header } = props;

  const { t } = useTranslation()

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography>{header}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <ButtonGroup>
            <ButtonLink
              variant="contained"
              color="primary"
              size="large"
              to="/login"
            >
              {t('global.login')}
            </ButtonLink>
            <ButtonLink
              variant="contained"
              color="secondary"
              size="large"
              to="/register"
            >
              {t('global.register')}
            </ButtonLink>
          </ButtonGroup>
        </Box>
      </Grid>
    </Grid>
  );
}

export default NeedToBeLoggedIn;
