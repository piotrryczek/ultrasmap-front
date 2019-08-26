import React from 'react';
import Typography from '@material-ui/core/Typography';

function Errors(props) {
  const { errors } = props;

  return (
    <>
      <Typography gutterBottom>Wystąpiły błędy:</Typography>
      <ul className="errors">
        {Array.isArray(errors) && errors.map((error, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>{error}</li>
        ))}
        {typeof errors === 'string' && (
          <li>{errors}</li>
        )}
      </ul>
    </>
    
  );
}

export default Errors;
