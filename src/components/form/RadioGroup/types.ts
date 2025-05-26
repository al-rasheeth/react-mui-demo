import { ReactNode } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { RadioGroup as MuiRadioGroup } from '@mui/material';
import { FormFieldProps } from '../FormField';

/**
 * Option format for the radio group component
 */
export type RadioOption = {
  /** The value that will be stored in the form state */
  value: string | number;
  /** The label displayed to the user */
  label: string;
};

/**
 * Props for the RadioGroup component
 */
export type RadioGroupProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiRadioGroup>,
  'name' | 'defaultValue'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
    /** The available options */
    options: RadioOption[];
    /** Custom renderer for options */
    renderOption?: (option: RadioOption) => ReactNode;
  }; 