import * as yup from 'yup';

import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from 'config/config';

export default yup.object().shape({
  name: yup
    .string()
    .required(),
  newLogo: yup.mixed()
    .test('fileSize', "File Size is too large", value => !value || (value && value.size <= MAX_FILE_SIZE))
    .test('fileType', "Unsupported File Format", value => !value || (value && SUPPORTED_FORMATS.includes(value.type))),
  tier: yup
    .number()
    .required(),
  coordinates: yup
    .array().of(yup.string())
    .required(),
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
