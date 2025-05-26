import { FieldValues, Path } from 'react-hook-form';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormFieldProps } from '../FormField';

/**
 * Props for the DatePicker component
 */
export type DatePickerProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiDatePicker>,
  'value' | 'onChange'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
  }; 