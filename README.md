# FanaticsMap

The application visualizes relationships between supporters of sports teams and allows logged in users to suggest changes to existing clubs or to suggest adding a new club.

piotrryczek@gmail.com

- API https://github.com/piotrryczek/ultrasmap-api
- Admin https://github.com/piotrryczek/ultrasmap-admin
- Frontend https://github.com/piotrryczek/ultrasmap-front

## FanaticsMap: Frontend (Map)
Frontend part.
Live:

- Demo: http://ultrasmap-demo-front.piotrryczek.pl
- Developer: http://ultrasmap-front.piotrryczek.pl
- Production: https://www.fanaticsmap.pl

### Build
```
npm install
npm run build-{env}
```
(env: dev / prod / demo)

### Main dependencies
Go to API part:
https://github.com/piotrryczek/ultrasmap-api

Based on Create React App.
- [react](https://github.com/facebook/react "React") (function components with hooks)
- [redux](https://github.com/reduxjs/redux "Redux")
- [react-router](https://github.com/ReactTraining/react-router "react-router")
- [material-ui](https://github.com/mui-org/material-ui "MaterialUI")
- [i18next](https://github.com/i18next/i18next "i18next")
- [axios](https://github.com/axios/axios "axios")
- [classnames](https://github.com/JedWatson/classnames "classnames")
- [lodash](https://github.com/lodash/lodash "lodash")
- [formik](https://github.com/jaredpalmer/formik "formik")
- [yup](https://github.com/jquense/yup "yup")
- [use-debounce](https://github.com/xnimorz/use-debounce "use-debounce")
- [react-google-maps](https://github.com/tomchentw/react-google-maps "react-google-maps")
- [immutability-helper](https://github.com/kolodny/immutability-helper " immutability-helper")
- [react-select](https://github.com/JedWatson/react-select "react-select")
- [react-custom-scrollbars](https://github.com/malte-wessel/react-custom-scrollbars "react-custom-scrollbars")
- [geo-lib](https://github.com/manuelbieh/geolib "geolib")

### Environments
- Production (production.env)
- Developer (developer.env)
- Localhost (localhost.env)
- Demo (demo.env)

### Main features
- Registration and login
- Searching for clubs
- Displaying relations between clubs (map & side panel)
- Fully responsive with mobile version
- Suggesting new club or changes to existing one
- Random club
- Internationalization with both localStorage and API integration