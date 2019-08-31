import React, { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { languages, DEFAULT_LANGUAGE } from 'config/config';
import Api from 'services/api';
import i18n from 'config/i18n';

//
function Languages() {
  const [ifShowLanguages, setIfShowLanguages] = useState(false);
  const isAuthenticated = useSelector(state => state.app.isAuthenticated);


  const handleChangeLanguage = languageCode => () => {
    localStorage.setItem('language', languageCode);
    i18n.changeLanguage(languageCode);
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
