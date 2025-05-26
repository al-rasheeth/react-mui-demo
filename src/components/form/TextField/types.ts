import { FieldValues, Path } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';
import { FormFieldProps } from '../FormField';

/**
 * Props for the TextField component
 */
export type TextFieldProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiTextField>,
  'name' | 'error' | 'helperText'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
  }; 