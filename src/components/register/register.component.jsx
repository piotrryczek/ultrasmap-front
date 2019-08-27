import React, { useCallback, useState } from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import _get from 'lodash/get';

import history from 'config/history';
import Api from 'services/api';
import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import registerSchema from 'schemas/register';
import RegisterForm from './registerForm.component';

function Register() {
  const { isAuthenticated } = useSelector(state => ({ isAuthenticated: _get(state, 'app.isAuthenticated', false) }));

  if (isAuthenticated) history.push('/');

  const { t } = useTranslation();
  const [hasRegistered, setHasRegistered] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleFormSubmit = useCallback(async (values) => {
    const { email, password } = values;

    try {
      await Api.post('/users/register', {
        email,
        password,
      }, false);

      setHasRegistered(true);
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
  }, []);

  return (
    <PageOverlay>
      {hasRegistered ? (
        <p>Rejestracja udana, sprawdź email aby zakończyć proces rejestracji</p>
      ) : (
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
      )}
      
    </PageOverlay>
  );
}

export default Register;
