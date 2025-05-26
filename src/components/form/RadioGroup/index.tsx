import React from 'react';
import { FieldValues } from 'react-hook-form';
import {
  RadioGroup as MuiRadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { FormField } from '../FormField';
import { RadioGroupProps } from './types';

/**
 * A form field wrapper around Material-UI's RadioGroup component
 */
export function RadioGroup<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  options,
  renderOption,
  controllerProps,
  rhfMode = true,
  ...rest
}: RadioGroupProps<T>) {
  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      controllerProps={controllerProps}
      rhfMode={rhfMode}
    >
      {({ field }) => (
        <MuiRadioGroup
          {...rest}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={renderOption ? renderOption(option) : option.label}
            />
          ))}
        </MuiRadioGroup>
      )}
    </FormField>
  );
} 