import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { useDebouncedCallback } from 'use-debounce';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useMobileStyles } from 'theme/useStyles';
import Api from 'services/api';

import FieldWrapper from 'common/fieldWrapper/fieldWrapper.component';
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
  const { t } = useTranslation();
  const mobileClasses = useMobileStyles({});
  const [prevEmail, setPrevEmail] = useState({
    value: '',
    error: null
  });

  const [checkApiEmail] = useDebouncedCallback(async (emailToCheck) => {
    const { data: ifExists } = await Api.get('/users/emailExists', {
      email: emailToCheck,
    });

    const error = ifExists ? t('formErrors.emailExists') : null;
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
          <Typography variant="h5">{t('register.header')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FieldWrapper error={touched.email && t(errors.email)}>
            <Field
              type="email"
              name="email"
              value={email}
              placeholder={t('register.emailPlaceholder')}
              onChange={handleChange}
              className={classNames('styled-input', { 'error': touched.email && errors.email })}
              validate={handleCheckEmail}
            />
          </FieldWrapper>
        </Grid>
        <Grid item xs={12}>
          <FieldWrapper error={touched.password && t(errors.password)}>
            <Field
              type="password"
              name="password"
              value={password}
              placeholder={t('register.passwordPlaceholder')}
              onChange={handleChange}
              className={classNames('styled-input', { 'error': touched.password && errors.password })}
            />
          </FieldWrapper>
        </Grid>
        <Grid item xs={12}>
          <FieldWrapper error={touched.confirmPassword && t(errors.confirmPassword)}>
            <Field
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder={t('register.confirmPasswordPlaceholder')}
              onChange={handleChange}
              className={classNames('styled-input', { 'error': touched.confirmPassword && errors.confirmPassword })}
            />
          </FieldWrapper>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <ButtonGroup className={mobileClasses.groupButton}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                type="submit"
                className={mobileClasses.buttonBase}
              >
                {t('register.register')}
              </Button>
              <ButtonLink
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                to="/login"
                className={mobileClasses.buttonBase}
              >
                {t('register.login')}
              </ButtonLink>
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <ButtonLink
              variant="contained"
              color="secondary"
              size="large"
              type="submit"
              to="/about"
              className={mobileClasses.buttonBase}
            >
              {t('global.aboutProject')}
            </ButtonLink>
          </Box>
        </Grid>
        {apiError && (
          <Grid item xs={12}>
            <Errors errors={t(`messageCodes.${apiError}`)} />
          </Grid>
        )}
      </Grid>
    </form>
  );
}

export default RegisterForm;
