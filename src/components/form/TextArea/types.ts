import { FieldValues, Path } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';
import { FormFieldProps } from '../FormField';

/**
 * Props for the TextArea component
 */
export type TextAreaProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiTextField>,
  'name' | 'error' | 'helperText' | 'multiline' | 'rows'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
    /** Number of rows for the textarea */
    rows?: number;
  }; 