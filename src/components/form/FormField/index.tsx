import React from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { FormHelperText, FormControl, FormLabel } from '@mui/material';
import { FormFieldProps } from './types';

/**
 * A wrapper component for form fields that integrates with react-hook-form
 */
export function FormField<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  children,
  controllerProps,
  rhfMode = true,
}: FormFieldProps<T>) {
  const methods = useFormContext<T>();
  
  // For non-rhf mode, create a simpler version without form context
  if (!rhfMode || !methods) {
    return (
      <FormControl fullWidth error={false} required={required}>
        {label && <FormLabel>{label}</FormLabel>}
        {children({
          field: {
            value: '',
            onChange: () => {},
            onBlur: () => {},
            ref: null,
            name: name as string,
          },
          fieldState: {
            invalid: false,
          },
        })}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <Controller
      name={name}
      control={methods.control}
      {...controllerProps}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={fieldState.invalid} required={required}>
          {label && <FormLabel>{label}</FormLabel>}
          {children({ field, fieldState })}
          <FormHelperText>
            {fieldState.error ? fieldState.error.message : helperText}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}

// Export the types directly from the component file
export type { FormFieldProps, FormFieldRenderProps } from './types'; 