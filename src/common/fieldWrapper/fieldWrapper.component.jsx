import React from 'react';

function FieldWrapper(props) {
  const { error, children } = props;

  return (
    <div className="field-wrapper">
      {error && (
        <p className="error-label">{error}</p>
      )}
      {children}
    </div>
  );
}

export default FieldWrapper;
