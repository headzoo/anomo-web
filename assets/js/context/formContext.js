import React from 'react';

const FormContext = React.createContext({
  values:      {},
  errorFields: {},
  disabled:    false,
  required:    false,
  onChange:    null
});

export default FormContext;
