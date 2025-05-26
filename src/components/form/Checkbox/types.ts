import { FieldValues, Path } from 'react-hook-form';
import { Checkbox as MuiCheckbox } from '@mui/material';
import { FormFieldProps } from '../FormField';

/**
 * Props for the Checkbox component
 */
export type CheckboxProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiCheckbox>,
  'name' | 'checked'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
  }; 