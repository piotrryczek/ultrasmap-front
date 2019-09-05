import { isMobile } from 'react-device-detect';

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
export const DEFAULT_COORDINATES = [19.3617687, 51.8983513];
export const DEFAULT_ZOOM = isMobile ? 9 : 10;
export const MAX_FILE_SIZE = 10 * 1000 * 1024;
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
export const USER_LANGUAGE = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;