import React from 'react';
import { FieldValues } from 'react-hook-form';
import {
  Switch as MuiSwitch,
  FormControlLabel,
} from '@mui/material';
import { FormField } from '../FormField';
import { SwitchProps } from './types';

/**
 * A form field wrapper around Material-UI's Switch component
 */
export function Switch<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  controllerProps,
  rhfMode = true,
  ...rest
}: SwitchProps<T>) {
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
            <MuiSwitch
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