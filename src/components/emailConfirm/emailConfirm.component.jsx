import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import ButtonLink from 'common/buttonLink/buttonLink.component';
import Errors from 'common/errors/errors.component';

import Api from 'services/api';

function EmailConfirm(props) {
  const { t } = useTranslation();

  const {
    match: {
      params: {
        verificationCode,
      }
    }
  } = props;

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [apiError, setApiError] = useState(null);

  const verifyUser = async () => {
    try {
      await Api.patch('/users/verify', {
        verificationCode,
      }, false);

      setIsConfirmed(true);
    } catch (error) {
      const {
        response: {
          data: {
            type,
          },
        },
      } = error;

      setApiError(t(type));
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <PageOverlay>
      <Grid container spacing={3}>
        {isConfirmed ? (
          <>
            <Grid item xs={12}>
              <Typography>Email został zweryfikowany, zaloguj się danymi podanymi podczas rejestracji.</Typography>
            </Grid>
            <Grid item xs={12}>
              <ButtonLink
                variant="contained"
                color="primary"
                size="large"
                to="/login"
              >
                Przejdź do logowania
              </ButtonLink>
            </Grid>
          </>
        ) : apiError ? (
          <Grid item xs={12}>
            <Errors errors={apiError} />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography>Zaczekaj trwa weryfikacja...</Typography>
          </Grid>
        )}
      </Grid>
    </PageOverlay>
  );
}

export default EmailConfirm;
