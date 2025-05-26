import React from 'react';
import { FieldValues } from 'react-hook-form';
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FormField } from '../FormField';
import { SelectProps } from './types';

/**
 * A form field wrapper around Material-UI's Select component
 */
export function Select<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  options,
  renderOption,
  controllerProps,
  rhfMode = true,
  ...rest
}: SelectProps<T>) {
  return (
    <FormField<T>
      name={name}
      label={undefined}
      helperText={helperText}
      required={required}
      controllerProps={controllerProps}
      rhfMode={rhfMode}
    >
      {({ field, fieldState }) => (
        <FormControl fullWidth error={fieldState.invalid}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <MuiSelect
            {...field}
            {...rest}
            labelId={`${name}-label`}
            label={label}
            value={field.value ?? ''}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {renderOption ? renderOption(option) : option.label}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      )}
    </FormField>
  );
} 