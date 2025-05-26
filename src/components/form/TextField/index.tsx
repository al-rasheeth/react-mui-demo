import React from 'react';
import { FieldValues } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';
import { FormField } from '../FormField';
import { TextFieldProps } from './types';

/**
 * A form field wrapper around Material-UI's TextField component
 */
export function TextField<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  controllerProps,
  rhfMode = true,
  ...rest
}: TextFieldProps<T>) {
  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      controllerProps={controllerProps}
      rhfMode={rhfMode}
    >
      {({ field, fieldState }) => (
        <MuiTextField
          {...field}
          {...rest}
          error={fieldState.invalid}
          InputLabelProps={{ shrink: Boolean(field.value) }}
        />
      )}
    </FormField>
  );
} 