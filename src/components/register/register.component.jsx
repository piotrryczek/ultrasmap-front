import React, { useCallback, useState } from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import _get from 'lodash/get';

import Typography from '@material-ui/core/Typography';

import history from 'config/history';
import Api from 'services/api';
import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';
import registerSchema from 'schemas/register';
import RegisterForm from './registerForm.component';

function Register() {
  const { isAuthenticated } = useSelector(state => ({ isAuthenticated: _get(state, 'app.isAuthenticated', false) }));

  if (isAuthenticated) history.push('/');

  const { t } = useTranslation();

  const [state, setState] = useState({
    hasRegistered: false,
    apiError: null,
    isLoading: false,
  });

  const {
    hasRegistered,
    apiError,
    isLoading,
  } = state;

  const handleFormSubmit = useCallback(async (values) => {
    const { email, password } = values;

    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      await Api.post('/users/register', {
        email,
        password,
      }, false);

      setState(prevState => ({
        ...prevState,
        isLoading: false,
        hasRegistered: true,
      }));
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
        isLoading: false,
        apiError: t(type),
      }));
    }
  }, []);

  return (
    <PageOverlay>
      {hasRegistered ? (
        <Typography>{t('register.success')}</Typography>
      ) : (
        <LoadingWrapper isLoading={isLoading} type="small">
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleFormSubmit}
            // eslint-disable-next-line react/jsx-props-no-spreading
            render={(props) => <RegisterForm {...props} apiError={apiError} />}
          />
        </LoadingWrapper>
      )}
      
    </PageOverlay>
  );
}

export default Register;
