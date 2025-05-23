import { FieldValues, Path } from 'react-hook-form';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { FormField, FormFieldProps } from './FormField';

export type TextFieldProps<T extends FieldValues> = Omit<
  MuiTextFieldProps,
  'name' | 'error' | 'helperText'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
  };

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