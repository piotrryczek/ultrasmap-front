import React, { useState } from 'react';
import classNames from 'classnames';

import { languages } from 'config/config';

// Prawdopodobnie z reduxa zasysaj jezyk
function Languages() {
  console.log('Languages render')

  const [ifShowLanguages, setIfShowLanguages] = useState(false);

  const handleChangeLanguage = languageCode => () => {
    localStorage.setItem('language', languageCode);
  }

  const handleShowLanguages = () => {
    setIfShowLanguages(true);
  }

  const handleHideLanguages = () => {
    setIfShowLanguages(false);
  }

  const currentLanguageCode = 'pl'; //localStorage.getItem('language');
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

export default Languages;
