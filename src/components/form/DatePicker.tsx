import { FieldValues, Path } from 'react-hook-form';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormField, FormFieldProps } from './FormField';

export type RHFDatePickerProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiDatePicker>,
  'value' | 'onChange'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
  };

export function DatePicker<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  controllerProps,
  rhfMode = true,
  ...rest
}: RHFDatePickerProps<T>) {
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