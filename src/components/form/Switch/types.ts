import { FieldValues, Path } from 'react-hook-form';
import { Switch as MuiSwitch } from '@mui/material';
import { FormFieldProps } from '../FormField';

/**
 * Props for the Switch component
 */
export type SwitchProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiSwitch>,
  'name' | 'checked'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
  }; 