import React from 'react';
import { FieldValues } from 'react-hook-form';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from '@mui/material';
import { FormField } from '../FormField';
import { CheckboxProps } from './types';

/**
 * A form field wrapper around Material-UI's Checkbox component
 */
export function Checkbox<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  controllerProps,
  rhfMode = true,
  ...rest
}: CheckboxProps<T>) {
  return (
    <FormField<T>
      name={name}
      label={undefined}
      helperText={helperText}
      required={required}
      controllerProps={controllerProps}
      rhfMode={rhfMode}
    >
      {({ field }) => (
        <FormControlLabel
          control={
            <MuiCheckbox
              {...rest}
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              name={field.name}
              inputRef={field.ref}
            />
          }
          label={label || ''}
        />
      )}
    </FormField>
  );
} 