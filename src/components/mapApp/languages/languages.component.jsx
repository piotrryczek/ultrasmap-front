import React, { useState, memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { setLanguage } from 'components/app/app.actions';
import { languages, DEFAULT_LANGUAGE, USER_LANGUAGE } from 'config/config';
import Api from 'services/api';
import i18n from 'config/i18n';

//
function Languages() {
  const [ifShowLanguages, setIfShowLanguages] = useState(false);
  const isAuthenticated = useSelector(state => state.app.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    // If not logged in or localStorage empty set user language depending on browser settings
    if (!isAuthenticated && !localStorage.getItem('language')) {
      handleChangeLanguage(USER_LANGUAGE.slice(0, 2));
    }
  }, []);

  const handleChangeLanguage = languageCode => () => {
    localStorage.setItem('language', languageCode); // localStorage
    i18n.changeLanguage(languageCode); // i18n
    dispatch(setLanguage(languageCode)); // Redux
    setIfShowLanguages(false);
    
    if (isAuthenticated) {
      Api.patch('/users/updateLanguage', {
        language: languageCode,
      });
    }
  }

  const handleShowLanguages = () => {
    setIfShowLanguages(true);
  }

  const handleHideLanguages = () => {
    setIfShowLanguages(false);
  }

  const currentLanguageCode = localStorage.getItem('language') || DEFAULT_LANGUAGE;
  const currentLanguage = languages.find(language => language.code === currentLanguageCode);
  const otherThanCurrentLanguages = languages.filter(language => language.code !== currentLanguageCode)

  return (
    <section
      id="languages-selection"
      onMouseEnter={handleShowLanguages}
      onMouseLeave={handleHideLanguages}
      onFocus={handleShowLanguages}
      onBlur={handleHideLanguages}
    >
      <button type="button" className="language current">
        <img src={`/assets/${currentLanguage.flag}`} alt="" />
      </button>
      <ul
        className={classNames('languages', {
          'show': ifShowLanguages,
        })}
      >
        {otherThanCurrentLanguages.map(({ code, flag }) => (
          <li key={code}>
            <button type="button" onClick={handleChangeLanguage(code)} className="language">
              <img src={`/assets/${flag}`} alt="" />
            </button>
          </li>
        ))}
      </ul>
    </section>
    
  );
}

export default memo(Languages);
