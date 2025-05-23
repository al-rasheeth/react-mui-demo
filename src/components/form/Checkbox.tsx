import { FieldValues, Path } from 'react-hook-form';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
} from '@mui/material';
import { FormField, FormFieldProps } from './FormField';

export type CheckboxProps<T extends FieldValues> = Omit<
  MuiCheckboxProps,
  'name' | 'checked'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
  };

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
      {({ field, fieldState }) => (
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