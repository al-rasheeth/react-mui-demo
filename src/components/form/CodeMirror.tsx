import { useEffect } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import ReactCodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { FormField, FormFieldProps } from './FormField';
import { Box, FormHelperText } from '@mui/material';

export type CodeMirrorProps<T extends FieldValues> = Omit<
  ReactCodeMirrorProps,
  'value' | 'onChange'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    name: Path<T>;
    height?: string;
    language?: 'javascript' | 'typescript' | 'json' | 'plain';
  };

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
        // Determine which language extension to use
        const languageExtension = (() => {
          switch (language) {
            case 'javascript':
              return javascript();
            case 'typescript':
              return javascript({ typescript: true });
            case 'json':
              return javascript({ jsx: false });
            case 'plain':
            default:
              return [];
          }
        })();

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