import React from 'react';
import { FieldValues } from 'react-hook-form';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormField } from '../FormField';
import { DatePickerProps } from './types';

/**
 * A form field wrapper around Material-UI's DatePicker component
 */
export function DatePicker<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  controllerProps,
  rhfMode = true,
  ...rest
}: DatePickerProps<T>) {
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
        <MuiDatePicker
          {...rest}
          label={label}
          value={field.value || null}
          onChange={(date: Date | null) => field.onChange(date)}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              error: fieldState.invalid,
              helperText: fieldState.error ? fieldState.error.message : helperText,
              inputRef: field.ref,
            },
          }}
        />
      )}
    </FormField>
  );
} 