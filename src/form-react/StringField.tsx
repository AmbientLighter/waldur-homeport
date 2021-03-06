import * as React from 'react';

import { FormField } from './types';

interface StringFieldProps extends FormField {
  placeholder?: string;
}

export const StringField = (props: StringFieldProps) => {
  const { input, label, validate, ...rest } = props;
  return (
    <input
      {...props.input}
      type="text"
      className="form-control"
      {...rest}
    />
  );
};
