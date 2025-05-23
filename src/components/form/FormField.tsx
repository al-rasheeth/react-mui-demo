import { ReactNode } from 'react';
import { Controller, FieldValues, UseControllerProps, useFormContext, Path } from 'react-hook-form';
import { FormHelperText, FormControl, FormLabel } from '@mui/material';

export type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  helperText?: string;
  required?: boolean;
  children: (props: {
    field: { 
      value: any; 
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      ref: React.Ref<any>;
      name: string;
    };
    fieldState: { 
      invalid: boolean; 
      error?: { message?: string };
    };
  }) => ReactNode;
  controllerProps?: Omit<UseControllerProps<T>, 'name'>;
  rhfMode?: boolean;
};

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