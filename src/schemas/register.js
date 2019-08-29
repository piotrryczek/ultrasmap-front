import * as yup from 'yup';

export default yup.object().shape({
  email: yup
    .string()
    .email('formErrors.email')
    .required('formErrors.required'),
  password: yup
    .string()
    .required('formErrors.required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'formErrors.passwordsNotMatch')
});
