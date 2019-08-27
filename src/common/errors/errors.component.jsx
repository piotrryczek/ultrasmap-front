import React from 'react';
import Typography from '@material-ui/core/Typography';

function Errors(props) {
  const { errors, touched } = props;

  return (
    <>
      <Typography gutterBottom>Wystąpiły błędy:</Typography>
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
