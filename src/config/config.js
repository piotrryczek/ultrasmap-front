export const IMAGES_URL = `${process.env.REACT_APP_API_URL}/images`;
export const DEFAULT_LANGUAGE = 'pl';
export const languages = [{
  code: 'pl',
  flag: 'pl.png',
}, {
  code: 'en',
  flag: 'en.png',
}, 
// {
//   code: 'ru',
//   flag: 'ru.png',
// }
];
export const DEFAULT_COORDINATES = [51.8983513, 19.3617687];
export const MAX_FILE_SIZE = 10 * 1000 * 1024;
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
export const MAP_BOUND_MAXIMUM = 1000000; // in meters, 1000km