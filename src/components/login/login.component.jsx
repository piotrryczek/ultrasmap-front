import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import _get from 'lodash/get';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Auth from 'services/auth';
import history from 'config/history';
import Errors from 'common/errors/errors.component';
import ButtonLink from 'common/buttonLink/buttonLink.component';
import { Typography } from '@material-ui/core';

function Login() {
  const { t } = useTranslation();

  const { isAuthenticated } = useSelector(state => ({ isAuthenticated: _get(state, 'app.isAuthenticated', false) }));

  const [state, setState] = useState({
    email: '',
    password: '',
    error: null,
    isLoading: false,
    loginBlur: false,
  });

  const {
    email,
    password,
    error,
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
        error: t(type),
        isLoading: false,
      }));
    }
    
  }, [email, password]);

  return (
    <PageOverlay>
      {loginBlur && isAuthenticated ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography>Zalogowałeś się pomyślnie. Wróc do mapy.</Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonLink
              variant="contained"
              color="primary"
              size="large"
              to="/"
            >
              Back to map
            </ButtonLink>
          </Grid>
        </Grid>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={classNames('handle-loading', { 'loading': isLoading })}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Email..."
                onChange={handleChange}
                className={classNames('styled-input', { 'error': error })}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Password..."
                onChange={handleChange}
                className={classNames('styled-input', { 'error': error })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  type="submit"
                >
                  Login
                </Button>
              </Box>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Errors errors={error} />
              </Grid>
            )}
          </Grid>
        </form>
      )}
    </PageOverlay>
  );
}

export default Login;
