import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { Box, Tabs, Tab, Paper, FormHelperText } from '@mui/material';
import { FormField } from '../FormField';
import { MarkdownEditorProps } from './types';
import { defaultToolbarOptions, insertMarkdownSyntax, setCursorPosition } from './utils';
import TabPanel from './TabPanel';
import Toolbar from './Toolbar';
import Editor from './Editor';
import Preview from './Preview';

/**
 * A rich markdown editor component with preview functionality
 */
export function MarkdownEditor<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  height = '400px',
  placeholder = 'Write markdown here...',
  showToolbar = true,
  controllerProps,
  rhfMode = true,
}: MarkdownEditorProps<T>) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
        const handleToolbarClick = (prefix: string, suffix: string, example: string) => {
          const newValue = insertMarkdownSyntax(
            field.name,
            field.value || '',
            prefix,
            suffix,
            example
          );
          
          field.onChange(newValue);
          
          // Set cursor position after the inserted text
          const cursorPos = (field.value?.length || 0) + prefix.length + example.length + suffix.length;
          setCursorPosition(field.name, cursorPos);
        };

        return (
          <Box sx={{ width: '100%' }}>
            <Paper variant="outlined" sx={{ mb: 1 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                aria-label="markdown editor tabs"
                variant="fullWidth"
              >
                <Tab label="Write" id="markdown-tab-0" aria-controls="markdown-tabpanel-0" />
                <Tab label="Preview" id="markdown-tab-1" aria-controls="markdown-tabpanel-1" />
              </Tabs>

              {showToolbar && (
                <Toolbar 
                  options={defaultToolbarOptions}
                  onOptionClick={handleToolbarClick}
                />
              )}

              <TabPanel value={tabValue} index={0}>
                <Editor
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  height={height}
                  placeholder={placeholder}
                />
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Preview content={field.value || ''} />
              </TabPanel>
            </Paper>
            
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