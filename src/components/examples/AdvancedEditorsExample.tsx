import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Stack, Typography, Paper, Tabs, Tab } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  FormProvider,
  TextField,
  TextArea,
  CodeMirror,
  MarkdownEditor,
  FileUpload,
} from '../form';

// Define the form schema with Zod for validation
const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  jsCode: z.string().min(5, 'Code must be at least 5 characters'),
  tsCode: z.string().min(5, 'Code must be at least 5 characters'),
  markdown: z.string().min(10, 'Markdown content must be at least 10 characters'),
  notes: z.string().optional(),
  attachments: z.any().optional(),
});

// Infer the TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>;

// TabPanel component for the different editor modes
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
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export function AdvancedEditorsExample() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Initialize form with react-hook-form
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      jsCode: '// Write your JavaScript code here\nfunction greeting() {\n  return "Hello, world!";\n}',
      tsCode: '// Write your TypeScript code here\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = {\n  name: "John",\n  age: 30\n};',
      markdown: '# Markdown Editor\n\nThis is a *markdown* editor with **formatting** support.\n\n- List item 1\n- List item 2\n\n```\nconst code = "formatted";\n```',
      notes: '',
      attachments: null,
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    setFormData(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Advanced Editors Example
        </Typography>

        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Form Fields" />
            <Tab label="Code Editors" />
            <Tab label="Markdown & File Upload" />
          </Tabs>
        </Paper>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <TabPanel value={tabValue} index={0}>
              <Stack spacing={3}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                
                <TextField<FormValues>
                  name="title"
                  label="Title"
                  required
                />

                <TextArea<FormValues>
                  name="description"
                  label="Description"
                  rows={4}
                  required
                  helperText="Provide a detailed description"
                />

                <TextField<FormValues>
                  name="notes"
                  label="Additional Notes"
                  multiline
                  rows={2}
                />
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Stack spacing={3}>
                <Typography variant="h6" gutterBottom>
                  Code Editors
                </Typography>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    JavaScript Editor
                  </Typography>
                  <CodeMirror<FormValues>
                    name="jsCode"
                    language="javascript"
                    height="200px"
                    required
                    helperText="Write JavaScript code here"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    TypeScript Editor
                  </Typography>
                  <CodeMirror<FormValues>
                    name="tsCode"
                    language="typescript"
                    height="200px"
                    required
                    helperText="Write TypeScript code here"
                  />
                </Box>
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Stack spacing={3}>
                <Typography variant="h6" gutterBottom>
                  Rich Text & File Upload
                </Typography>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Markdown Editor
                  </Typography>
                  <MarkdownEditor<FormValues>
                    name="markdown"
                    height="300px"
                    required
                    helperText="Write markdown content with preview support"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    File Upload
                  </Typography>
                  <FileUpload<FormValues>
                    name="attachments"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    maxSize={5 * 1024 * 1024} // 5MB
                    multiple
                    helperText="Upload documents or images (max 5MB)"
                  />
                </Box>
              </Stack>
            </TabPanel>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Stack direction="row" spacing={2}>
                <Button 
                  type="button" 
                  variant="outlined"
                  onClick={() => methods.reset()}
                >
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          </Paper>
        </FormProvider>

        {/* Display submitted data */}
        {formData && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Submitted Data
            </Typography>
            <Box sx={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              '& pre': {
                m: 0,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }
            }}>
              <pre>
                {JSON.stringify({
                  ...formData,
                  // Don't show full file objects in the output
                  attachments: formData.attachments 
                    ? Array.isArray(formData.attachments)
                      ? `[${formData.attachments.length} files]`
                      : '1 file'
                    : null
                }, null, 2)}
              </pre>
            </Box>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
} 