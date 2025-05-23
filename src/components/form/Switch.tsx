import { FieldValues, Path } from 'react-hook-form';
import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
  FormControlLabel,
} from '@mui/material';
import { FormField, FormFieldProps } from './FormField';

export type SwitchProps<T extends FieldValues> = Omit<
  MuiSwitchProps,
  'name' | 'checked'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
  };

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
      {({ field, fieldState }) => (
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