import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

function Errors(props) {
  const { t } = useTranslation();
  const { errors, touched } = props;

  return (
    <>
      <Typography gutterBottom>{t('global.errorsOccured')}</Typography>
      <ul className="errors">
        {typeof errors === 'string' ? (
          <li>{errors}</li>
        ) : (
          Object.entries(errors).map(([name, value]) => touched[name] && (
            <li key={name}>{value}</li>
          ))
        )}
      </ul>
    </>
    
  );
}

export default Errors;
