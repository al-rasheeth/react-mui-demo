import { ReactNode } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FormField, FormFieldProps } from './FormField';

export type SelectOption = {
  value: string | number;
  label: string;
};

export type SelectProps<T extends FieldValues> = Omit<
  MuiSelectProps,
  'name' | 'error' | 'label'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
    options: SelectOption[];
    renderOption?: (option: SelectOption) => ReactNode;
  };

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