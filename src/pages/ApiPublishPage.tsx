import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Alert, Chip, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FormStepper } from '@components/form/FormStepper';
import { FormProvider } from '@components/form/FormProvider';
import { useForm } from 'react-hook-form';
import { TextField } from '@components/form/TextField';
import { Select } from '@components/form/Select';
import { FileUpload } from '@components/form/FileUpload';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStepProps } from '@components/form/FormStepper/types';

// Define form schema with validation
const formSchema = z.object({
  // Step 1: Metadata
  category: z.string().min(1, 'Category is required'),
  service: z.string().min(1, 'Service is required'),
  version: z.string().min(1, 'Version is required'),
  
  // Step 2: Import
  importType: z.enum(['file', 'url']),
  fileSource: z.instanceof(File).optional().nullable(),
  urlSource: z.string().url('Please enter a valid URL').optional().nullable(),
  
  // Additional metadata
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Categories and their services
const categories = [
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'technology', label: 'Technology' },
];

const services = {
  finance: [
    { value: 'payment', label: 'Payment Processing' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'banking', label: 'Banking' },
  ],
  healthcare: [
    { value: 'patient', label: 'Patient Records' },
    { value: 'appointment', label: 'Appointment Scheduling' },
    { value: 'billing', label: 'Medical Billing' },
  ],
  retail: [
    { value: 'inventory', label: 'Inventory Management' },
    { value: 'order', label: 'Order Processing' },
    { value: 'shipping', label: 'Shipping' },
  ],
  technology: [
    { value: 'cloud', label: 'Cloud Services' },
    { value: 'ai', label: 'AI & Machine Learning' },
    { value: 'iot', label: 'IoT' },
  ],
};

// Mock OAS validation function
const validateOasDocument = (file: File | string): Promise<{
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
  stats: {
    endpoints: number;
    schemas: number;
    version: string;
  };
}> => {
  return new Promise((resolve) => {
    // Simulate validation delay
    setTimeout(() => {
      // Mock validation result
      resolve({
        valid: true,
        errors: [
          { path: '/paths/users', message: 'Missing operation ID' },
          { path: '/components/schemas/User', message: 'Required property missing: id' },
        ],
        stats: {
          endpoints: 15,
          schemas: 8,
          version: '3.1.0',
        },
      });
    }, 1000);
  });
};

const ApiPublishPage: React.FC = () => {
  const [serviceOptions, setServiceOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: Array<{ path: string; message: string }>;
    stats: {
      endpoints: number;
      schemas: number;
      version: string;
    };
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      service: '',
      version: '',
      importType: 'file',
      fileSource: null,
      urlSource: null,
      description: '',
    },
  });

  const { watch, setValue } = methods;
  const category = watch('category');
  const importType = watch('importType');
  
  // Update service options when category changes
  useEffect(() => {
    if (category) {
      setServiceOptions(services[category as keyof typeof services] || []);
      // Reset service selection when category changes
      setValue('service', '');
    }
  }, [category, setValue]);

  // Define the steps for the form stepper
  const steps: FormStepProps[] = [
    {
      label: 'Metadata',
      content: (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            API Metadata
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Select
                name="category"
                label="Category"
                options={categories}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Select
                name="service"
                label="Service"
                options={serviceOptions}
                required
                fullWidth
                disabled={!category}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="version"
                label="Version"
                required
                fullWidth
                placeholder="e.g., 1.0.0"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Import',
      content: (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Import API Specification
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Select
                name="importType"
                label="Import Type"
                options={[
                  { value: 'file', label: 'File Upload' },
                  { value: 'url', label: 'URL' },
                ]}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              {importType === 'file' ? (
                <FileUpload
                  name="fileSource"
                  label="Upload OpenAPI Specification"
                  required
                  accept=".json,.yaml,.yml"
                  helperText="Upload an OpenAPI Specification file (JSON or YAML)"
                  multiple={false}
                />
              ) : (
                <TextField
                  name="urlSource"
                  label="OpenAPI Specification URL"
                  required
                  fullWidth
                  placeholder="https://example.com/api-spec.json"
                />
              )}
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Validate & Publish',
      content: (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Validation & Publication
          </Typography>
          
          {isValidating ? (
            <Alert severity="info">Validating API specification...</Alert>
          ) : validationResult ? (
            <Stack spacing={3}>
              <Alert severity={validationResult.valid ? "success" : "warning"}>
                {validationResult.valid 
                  ? "API specification is valid and ready to publish!" 
                  : "API specification has issues that need to be resolved."}
              </Alert>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>API Statistics</Typography>
                <Stack direction="row" spacing={2}>
                  <Chip label={`${validationResult.stats.endpoints} Endpoints`} color="primary" />
                  <Chip label={`${validationResult.stats.schemas} Schemas`} color="primary" />
                  <Chip label={`OAS ${validationResult.stats.version}`} color="primary" />
                </Stack>
              </Box>
              
              {validationResult.errors.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Validation Issues</Typography>
                  <Stack spacing={1}>
                    {validationResult.errors.map((error, index) => (
                      <Alert key={index} severity="error">
                        <Typography variant="body2"><strong>{error.path}</strong>: {error.message}</Typography>
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          ) : (
            <Alert severity="info">
              Click "Validate" to check your API specification.
            </Alert>
          )}
        </Box>
      ),
      actions: [
        {
          label: 'Validate',
          onClick: async () => {
            const values = methods.getValues();
            setIsValidating(true);
            
            try {
              const source = values.importType === 'file' ? values.fileSource : values.urlSource;
              if (source) {
                const result = await validateOasDocument(source);
                setValidationResult(result);
              }
            } catch (error) {
              console.error('Validation error:', error);
            } finally {
              setIsValidating(false);
            }
          },
          variant: 'outlined',
          color: 'primary',
        }
      ],
      validationHandler: async () => {
        // Only allow proceeding if validation was successful
        return !!validationResult?.valid;
      }
    }
  ];

  const handleComplete = async () => {
    const values = methods.getValues();
    console.log('Form submitted with values:', values);
    
    // Here you would typically submit the form data to your backend
    alert('API published successfully!');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Publish API
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Use this wizard to publish your OpenAPI specification
      </Typography>
      
      <FormProvider methods={methods}>
        <FormStepper
          steps={steps}
          onComplete={handleComplete}
          finishButtonLabel="Publish"
          linear={true}
          requireAllStepsComplete={true}
        />
      </FormProvider>
    </Container>
  );
};

export default ApiPublishPage; 