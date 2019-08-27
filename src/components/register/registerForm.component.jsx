import React, { useState } from 'react';
import { Field } from 'formik';
import { useDebouncedCallback } from 'use-debounce';
import classNames from 'classnames';


import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Api from 'services/api';

import Errors from 'common/errors/errors.component';
import ButtonLink from 'common/buttonLink/buttonLink.component';

function RegisterForm({
  apiError,
  errors,
  touched,
  handleChange,
  handleSubmit,
  values: {
    email,
    password,
    confirmPassword,
  },
  setFieldError,
}) {
  const [prevEmail, setPrevEmail] = useState({
    value: '',
    error: null
  });

  const [checkApiEmail] = useDebouncedCallback(async (emailToCheck) => {
    const { data: ifExists } = await Api.get('/users/emailExists', {
      email: emailToCheck,
    });

    const error = ifExists ? 'Email exists' : null;
    if (ifExists) setFieldError('email', error);
    
    setPrevEmail({
      error,
      value: emailToCheck,
    });
  }, 300);


  const handleCheckEmail = async (emailToCheck) => {
    if (prevEmail.value === emailToCheck) {
      return prevEmail.error;
    }

    checkApiEmail(emailToCheck);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Rejestracja</Typography>
        </Grid>
        <Grid item xs={12}>
          <div className="field-wrapper">
            {touched.email && errors.email && (
              <p className="error-label">{errors.email}</p>
            )}
            <Field
              type="email"
              name="email"
              value={email}
              placeholder="Email..."
              onChange={handleChange}
              className={classNames('styled-input', { 'error': touched.email && errors.email })}
              validate={handleCheckEmail}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="field-wrapper">
            {touched.password && errors.password && (
              <p className="error-label">{errors.password}</p>
            )}
            <Field
              type="password"
              name="password"
              value={password}
              placeholder="Password..."
              onChange={handleChange}
              className={classNames('styled-input', { 'error': touched.password && errors.password })}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="field-wrapper">
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="error-label">{errors.confirmPassword}</p>
            )}
            <Field
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm password..."
              onChange={handleChange}
              className={classNames('styled-input', { 'error': touched.confirmPassword && errors.confirmPassword })}
            />
          </div>
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
                Register
              </Button>
              <ButtonLink
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                to="/login"
              >
                Masz już konto? Zaloguj się
              </ButtonLink>
            </ButtonGroup>
          </Box>
        </Grid>
        {apiError && (
          <Grid item xs={12}>
            <Errors errors={apiError} />
          </Grid>
        )}
      </Grid>
    </form>
  );
}

export default RegisterForm;
