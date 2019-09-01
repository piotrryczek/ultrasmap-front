import * as yup from 'yup';

import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from 'config/config';

export default yup.object().shape({
  name: yup
    .string()
    .required('formErrors.required'),
  newLogo: yup.mixed()
    .test('fileSize', 'formErrors.fileSize', value => !value || (value && value.size <= MAX_FILE_SIZE))
    .test('fileType', 'formErrors.fileType', value => !value || (value && SUPPORTED_FORMATS.includes(value.type))),
  coordinates: yup
    .array().of(yup.string())
    .required('formErrors.required'),
  friendships: yup
    .array().of(yup.string()),
  agreements: yup
    .array().of(yup.string()),
  positives: yup
    .array().of(yup.string()),
  satellites: yup
    .array().of(yup.string()),
  satelliteOf: yup
    .string()
    .nullable(),
});
