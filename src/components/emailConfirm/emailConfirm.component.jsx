import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
    <Grid container spacing={3}>
      {isConfirmed ? (
        <>
          <Grid item xs={12}>
            <Typography>{t('emailConfirm.emailVerified')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonLink
              variant="contained"
              color="primary"
              size="large"
              to="/login"
            >
              {t('emailConfirm.login')}
            </ButtonLink>
          </Grid>
        </>
      ) : apiError ? (
        <Grid item xs={12}>
          <Errors errors={t(`messageCodes.${apiError}`)} />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Typography>{t('emailConfirm.emailBeingVerified')}</Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default EmailConfirm;
