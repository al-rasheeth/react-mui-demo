import { ReactNode } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { Autocomplete as MuiAutocomplete } from '@mui/material';
import { FormFieldProps } from '../FormField';

/**
 * Option format for the autocomplete component
 */
export type AutocompleteOption = {
  /** The value that will be stored in the form state */
  value: string | number;
  /** The label displayed to the user */
  label: string;
};

/**
 * Props for the Autocomplete component
 */
export type AutocompleteProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiAutocomplete>,
  'name' | 'renderInput' | 'options' | 'onChange'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
    /** The available options */
    options: AutocompleteOption[];
    /** Placeholder text */
    placeholder?: string;
    /** Whether multiple values can be selected */
    multiple?: boolean;
    /** Custom renderer for options */
    renderOption?: (option: AutocompleteOption) => ReactNode;
  };