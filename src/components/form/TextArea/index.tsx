import React from 'react';
import { FieldValues } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';
import { FormField } from '../FormField';
import { TextAreaProps } from './types';

/**
 * A form field wrapper around Material-UI's TextField component configured as a multiline textarea
 */
export function TextArea<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  controllerProps,
  rhfMode = true,
  rows = 4,
  ...rest
}: TextAreaProps<T>) {
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
          multiline
          rows={rows}
          error={fieldState.invalid}
          InputLabelProps={{ shrink: Boolean(field.value) }}
        />
      )}
    </FormField>
  );
} 