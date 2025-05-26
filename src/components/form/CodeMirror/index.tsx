import React from 'react';
import { FieldValues } from 'react-hook-form';
import ReactCodeMirror from '@uiw/react-codemirror';
import { Box, FormHelperText } from '@mui/material';
import { FormField } from '../FormField';
import { CodeMirrorProps } from './types';
import { getLanguageExtension } from './utils';

/**
 * A code editor component with syntax highlighting
 */
export function CodeMirror<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  controllerProps,
  rhfMode = true,
  height = '200px',
  language = 'javascript',
  ...rest
}: CodeMirrorProps<T>) {
  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={undefined} // We'll handle the helper text separately
      required={required}
      controllerProps={controllerProps}
      rhfMode={rhfMode}
    >
      {({ field, fieldState }) => {
        // Get the language extension
        const languageExtension = getLanguageExtension(language);

        return (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              border: fieldState.invalid ? '1px solid' : 'none',
              borderColor: 'error.main',
              borderRadius: 1,
            }}
          >
            <ReactCodeMirror
              {...rest}
              value={field.value || ''}
              onChange={(value) => field.onChange(value)}
              height={height}
              extensions={[languageExtension]}
              onBlur={field.onBlur}
              ref={field.ref}
            />
            {fieldState.invalid && fieldState.error ? (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            ) : helperText ? (
              <FormHelperText>{helperText}</FormHelperText>
            ) : null}
          </Box>
        );
      }}
    </FormField>
  );
} 