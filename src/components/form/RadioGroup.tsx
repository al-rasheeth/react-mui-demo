import { ReactNode } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import {
  RadioGroup as MuiRadioGroup,
  RadioGroupProps as MuiRadioGroupProps,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { FormField, FormFieldProps } from './FormField';

export type RadioOption = {
  value: string | number;
  label: string;
};

export type RadioGroupProps<T extends FieldValues> = Omit<
  MuiRadioGroupProps,
  'name' | 'defaultValue'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
    options: RadioOption[];
    renderOption?: (option: RadioOption) => ReactNode;
  };

export function RadioGroup<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  options,
  renderOption,
  controllerProps,
  rhfMode = true,
  ...rest
}: RadioGroupProps<T>) {
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
        <MuiRadioGroup
          {...rest}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={renderOption ? renderOption(option) : option.label}
            />
          ))}
        </MuiRadioGroup>
      )}
    </FormField>
  );
} 