import { ReactNode } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import {
  Autocomplete as MuiAutocomplete,
  TextField,
} from '@mui/material';
import { FormField, FormFieldProps } from './FormField';

export type AutocompleteOption = {
  value: string | number;
  label: string;
};

export type AutocompleteProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof MuiAutocomplete>,
  'name' | 'renderInput' | 'options' | 'onChange'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
    options: AutocompleteOption[];
    placeholder?: string;
    multiple?: boolean;
    renderOption?: (option: AutocompleteOption) => ReactNode;
  };

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
                  ? newValue.map(item => item.value)
                  : [];
                field.onChange(values);
              } else {
                // For single selection
                const val = newValue ? (newValue as AutocompleteOption).value : null;
                field.onChange(val);
              }
            }}
            isOptionEqualToValue={(option, value) => 
              option && value ? option.value === value.value : option === value
            }
            getOptionLabel={(option) => {
              // Handle both object and string options
              if (typeof option === 'string') return option;
              return option?.label || '';
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {renderOption ? renderOption(option) : option.label}
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
} 