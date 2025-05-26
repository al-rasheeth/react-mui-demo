import { FieldValues, Path } from 'react-hook-form';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { FormField, FormFieldProps } from './FormField';

export type TextAreaProps<T extends FieldValues> = Omit<
  MuiTextFieldProps,
  'name' | 'error' | 'helperText' | 'multiline' | 'rows'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
    rows?: number;
  };

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