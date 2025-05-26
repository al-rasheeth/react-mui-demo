import React from 'react';
import { FieldValues } from 'react-hook-form';
import { Autocomplete as MuiAutocomplete, TextField } from '@mui/material';
import { FormField } from '../FormField';
import { AutocompleteOption, AutocompleteProps } from './types';
import { isOptionEqual, getOptionLabel } from './utils';

/**
 * A form field wrapper around Material-UI's Autocomplete component
 */
export function Autocomplete<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  options,
  placeholder,
  multiple = false,
  renderOption,
  controllerProps,
  rhfMode = true,
  ...rest
}: AutocompleteProps<T>) {
  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      controllerProps={controllerProps}
      rhfMode={rhfMode}
    >
      {({ field, fieldState }) => {
        // Handle different field values based on multiple mode
        const value = multiple
          ? options.filter((option) => 
              field.value && Array.isArray(field.value) && field.value.includes(option.value)
            )
          : options.find((option) => option.value === field.value) || null;

        return (
          <MuiAutocomplete
            {...rest}
            multiple={multiple}
            options={options}
            value={value}
            onChange={(_, newValue) => {
              if (multiple) {
                // For multiple selection, extract all values
                const values = Array.isArray(newValue) 
                  ? (newValue as AutocompleteOption[]).map(item => item.value)
                  : [];
                field.onChange(values);
              } else {
                // For single selection
                const val = newValue ? (newValue as AutocompleteOption).value : null;
                field.onChange(val);
              }
            }}
            isOptionEqualToValue={isOptionEqual}
            getOptionLabel={getOptionLabel}
            renderOption={(props, option) => (
              <li {...props} key={(option as AutocompleteOption).value}>
                {renderOption 
                  ? renderOption(option as AutocompleteOption) 
                  : (option as AutocompleteOption).label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                name={field.name}
                label={label}
                placeholder={placeholder}
                error={fieldState.invalid}
                helperText={fieldState.error ? fieldState.error.message : helperText}
                inputRef={field.ref}
                required={required}
              />
            )}
          />
        );
      }}
    </FormField>
  );
} 