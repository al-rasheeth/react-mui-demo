import { useState } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  FormHelperText,
  Typography,
  styled
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactCodeMirror from '@uiw/react-codemirror';
import { FormField, FormFieldProps } from './FormField';

// Custom styled components
const MarkdownPreviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: '600px',
  overflow: 'auto',
  '& img': {
    maxWidth: '100%'
  },
  '& pre': {
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto'
  },
  '& code': {
    backgroundColor: theme.palette.action.hover,
    padding: '2px 4px',
    borderRadius: 4,
    fontSize: '0.9em'
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.divider}`,
    margin: 0,
    paddingLeft: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  '& table': {
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1)
  },
  '& th': {
    backgroundColor: theme.palette.action.hover
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`markdown-tabpanel-${index}`}
      aria-labelledby={`markdown-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export type MarkdownEditorProps<T extends FieldValues> = Omit<FormFieldProps<T>, 'children'> & {
  name: Path<T>;
  height?: string;
  placeholder?: string;
  showToolbar?: boolean;
};

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

  // Simple markdown toolbar options
  const toolbarOptions = [
    { label: 'Bold', prefix: '**', suffix: '**', example: 'bold text' },
    { label: 'Italic', prefix: '_', suffix: '_', example: 'italic text' },
    { label: 'Heading', prefix: '## ', suffix: '', example: 'Heading' },
    { label: 'Link', prefix: '[', suffix: '](url)', example: 'link text' },
    { label: 'Image', prefix: '![', suffix: '](url)', example: 'alt text' },
    { label: 'Code', prefix: '```\n', suffix: '\n```', example: 'code here' },
    { label: 'List', prefix: '- ', suffix: '', example: 'List item' },
    { label: 'Quote', prefix: '> ', suffix: '', example: 'Quote text' },
  ];

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
          // Get current editor value and cursor position
          const textarea = document.querySelector(`textarea[name="${field.name}"]`) as HTMLTextAreaElement;
          if (!textarea) return;
          
          const start = textarea.selectionStart || 0;
          const end = textarea.selectionEnd || 0;
          const text = field.value || '';
          
          // If text is selected, wrap it with prefix and suffix
          // If not, insert example text
          const selectedText = text.substring(start, end);
          const replacement = selectedText || example;
          const newValue = 
            text.substring(0, start) + 
            prefix + replacement + suffix + 
            text.substring(end);
          
          field.onChange(newValue);
          
          // Focus after state update
          setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + replacement.length + suffix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
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
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    p: 1, 
                    borderBottom: 1, 
                    borderColor: 'divider' 
                  }}
                >
                  {toolbarOptions.map((option) => (
                    <Typography
                      key={option.label}
                      component="span"
                      variant="body2"
                      sx={{ 
                        px: 1, 
                        py: 0.5, 
                        bgcolor: 'action.hover', 
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.selected' }
                      }}
                      onClick={() => handleToolbarClick(option.prefix, option.suffix, option.example)}
                    >
                      {option.label}
                    </Typography>
                  ))}
                </Box>
              )}

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ p: 0 }}>
                  <ReactCodeMirror
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value)}
                    height={height}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder={placeholder}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      autocompletion: false
                    }}
                  />
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <MarkdownPreviewContainer>
                  {field.value ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {field.value}
                    </ReactMarkdown>
                  ) : (
                    <Typography color="text.secondary" sx={{ p: 2 }}>
                      Nothing to preview yet
                    </Typography>
                  )}
                </MarkdownPreviewContainer>
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