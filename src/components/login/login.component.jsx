import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Auth from 'services/auth';
import history from 'config/history';
import Errors from 'common/errors/errors.component';
import ButtonLink from 'common/buttonLink/buttonLink.component';
import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';

function Login() {
  const { t } = useTranslation();

  const isAuthenticated = useSelector(state => state.app.isAuthenticated);

  const [state, setState] = useState({
    email: '',
    password: '',
    apiError: null,
    isLoading: false,
    loginBlur: false,
  });

  const {
    email,
    password,
    apiError,
    isLoading,
    loginBlur,
  } = state;

  if (isAuthenticated && !loginBlur) history.push('/');

  const handleChange = useCallback((event) => {
    const { target: field } = event;

    const fieldName = field.getAttribute('name');

    setState(prevState => ({
      ...prevState,
      [fieldName]: field.value,
    }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    setState(prevState => ({
      ...prevState,
      isLoading: true,
      loginBlur: true,
    }));

    try {
      await Auth.login(email, password);

      setState(prevState => ({
        ...prevState,
        isLoading: false,
      }));

      // Komunikat o poprawnym logowaniu
    } catch (error) {
      const {
        response: {
          data: {
            type,
          },
        },
      } = error;

      setState(prevState => ({
        ...prevState,
        apiError: t(type),
        isLoading: false,
      }));
    }
    
  }, [email, password]);

  return (
    <PageOverlay>
      {loginBlur && isAuthenticated ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">{t('login.header')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>{t('login.success')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonLink
              variant="contained"
              color="primary"
              size="large"
              to="/"
            >
              {t('global.backToMap')}
            </ButtonLink>
          </Grid>
        </Grid>
      ) : (
        <LoadingWrapper isLoading={isLoading} type="small">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">{t('login.header')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder={t('login.emailPlaceholder')}
                  onChange={handleChange}
                  className={classNames('styled-input', { 'error': apiError })}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder={t('login.passwordPlaceholder')}
                  onChange={handleChange}
                  className={classNames('styled-input', { 'error': apiError })}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      type="submit"
                    >
                      {t('login.login')}
                    </Button>
                    <ButtonLink
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      to="/register"
                    >
                      {t('login.register')}
                    </ButtonLink>
                  </ButtonGroup>
                </Box>
              </Grid>
              {apiError && (
                <Grid item xs={12}>
                  <Errors errors={t(`messageCodes.${apiError}`)} />
                </Grid>
              )}
            </Grid>
          </form>
        </LoadingWrapper>
      )}
    </PageOverlay>
  );
}

export default Login;
