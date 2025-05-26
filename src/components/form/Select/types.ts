import { ReactNode } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { Select as MuiSelect } from '@mui/material';
import { FormFieldProps } from '../FormField';

/**
 * Option format for the select component
 */
export type SelectOption = {
  /** The value that will be stored in the form state */
  value: string | number;
  /** The label displayed to the user */
  label: string;
};

/**
 * Props for the Select component
 */
export type SelectProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiSelect>,
  'name' | 'error' | 'label'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
    /** The available options */
    options: SelectOption[];
    /** Custom renderer for options */
    renderOption?: (option: SelectOption) => ReactNode;
  }; 