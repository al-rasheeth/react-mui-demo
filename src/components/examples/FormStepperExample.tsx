import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Stack
} from '@mui/material';

import {
  FormProvider,
  TextField,
  Select,
  Checkbox,
  RadioGroup,
  TextArea,
  DatePicker,
  FormStepper,
  FormStepProps
} from '../form';

// Define the form schema with Zod for validation
const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  birthDate: z.date().optional(),
  
  // Address Information
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
  country: z.string().min(2, 'Country is required'),
  
  // Preferences
  preferredContact: z.string().min(1, 'Select preferred contact method'),
  receiveUpdates: z.boolean(),
  marketingConsent: z.boolean(),
  bio: z.string().optional(),
});

// Infer the TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>;

export function FormStepperExample() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [stepperOrientation, setStepperOrientation] = useState<'horizontal' | 'vertical' | 'mobile'>('horizontal');
  const [useLinearMode, setUseLinearMode] = useState(true);
  const [useAlternativeLabel, setUseAlternativeLabel] = useState(false);
  const [allowStepSkip, setAllowStepSkip] = useState(false);

  // Initialize form with react-hook-form
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: undefined,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      preferredContact: '',
      receiveUpdates: false,
      marketingConsent: false,
      bio: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    setFormData(data);
  };

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'mail', label: 'Postal Mail' },
  ];

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  // Create validation handlers for steps
  const validatePersonalInfo = () => {
    const fields = ['firstName', 'lastName', 'email', 'phone'];
    return methods.trigger(fields as any);
  };

  const validateAddressInfo = () => {
    const fields = ['address', 'city', 'state', 'zipCode', 'country'];
    return methods.trigger(fields as any);
  };

  const validatePreferences = () => {
    const fields = ['preferredContact'];
    return methods.trigger(fields as any);
  };

  // Steps for the stepper layout
  const steps: FormStepProps[] = [
    {
      label: 'Personal Information',
      content: (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField<FormValues>
              name="firstName"
              label="First Name"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField<FormValues>
              name="lastName"
              label="Last Name"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField<FormValues>
              name="email"
              label="Email"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField<FormValues>
              name="phone"
              label="Phone"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker<FormValues>
              name="birthDate"
              label="Birth Date"
            />
          </Grid>
        </Grid>
      ),
      validationHandler: validatePersonalInfo
    },
    {
      label: 'Address Information',
      content: (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField<FormValues>
              name="address"
              label="Address"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField<FormValues>
              name="city"
              label="City"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField<FormValues>
              name="state"
              label="State/Province"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField<FormValues>
              name="zipCode"
              label="Zip/Postal Code"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select<FormValues>
              name="country"
              label="Country"
              options={countryOptions}
              required
            />
          </Grid>
        </Grid>
      ),
      validationHandler: validateAddressInfo
    },
    {
      label: 'Preferences',
      content: (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <RadioGroup<FormValues>
              name="preferredContact"
              label="Preferred Contact Method"
              options={contactMethodOptions}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox<FormValues>
              name="receiveUpdates"
              label="Receive product updates"
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox<FormValues>
              name="marketingConsent"
              label="I consent to receiving marketing communications"
            />
          </Grid>
          <Grid item xs={12}>
            <TextArea<FormValues>
              name="bio"
              label="Bio"
              rows={4}
              helperText="Tell us about yourself"
            />
          </Grid>
        </Grid>
      ),
      validationHandler: validatePreferences,
      optional: true
    },
  ];

  // Handle stepper configuration changes
  const handleOrientationChange = (
    _: React.MouseEvent<HTMLElement>,
    newOrientation: 'horizontal' | 'vertical' | 'mobile',
  ) => {
    if (newOrientation !== null) {
      setStepperOrientation(newOrientation);
    }
  };

  const handleLinearModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: boolean,
  ) => {
    if (newValue !== null) {
      setUseLinearMode(newValue);
    }
  };

  const handleLabelModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: boolean,
  ) => {
    if (newValue !== null) {
      setUseAlternativeLabel(newValue);
    }
  };

  const handleSkipModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: boolean,
  ) => {
    if (newValue !== null) {
      setAllowStepSkip(newValue);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Form Stepper Example
      </Typography>

      {/* Configuration controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Stepper Configuration
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Orientation
            </Typography>
            <ToggleButtonGroup
              value={stepperOrientation}
              exclusive
              onChange={handleOrientationChange}
              aria-label="stepper orientation"
              size="small"
            >
              <ToggleButton value="horizontal">Horizontal</ToggleButton>
              <ToggleButton value="vertical">Vertical</ToggleButton>
              <ToggleButton value="mobile">Mobile</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Mode
            </Typography>
            <ToggleButtonGroup
              value={useLinearMode}
              exclusive
              onChange={handleLinearModeChange}
              aria-label="linear mode"
              size="small"
            >
              <ToggleButton value={true}>Linear</ToggleButton>
              <ToggleButton value={false}>Non-Linear</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Label Style (Horizontal only)
            </Typography>
            <ToggleButtonGroup
              value={useAlternativeLabel}
              exclusive
              onChange={handleLabelModeChange}
              aria-label="label style"
              size="small"
            >
              <ToggleButton value={false}>Standard</ToggleButton>
              <ToggleButton value={true}>Alternative</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Allow Step Skip
            </Typography>
            <ToggleButtonGroup
              value={allowStepSkip}
              exclusive
              onChange={handleSkipModeChange}
              aria-label="allow skip"
              size="small"
            >
              <ToggleButton value={false}>No</ToggleButton>
              <ToggleButton value={true}>Yes</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Note: Only optional steps can be skipped
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* Form Stepper */}
        <FormStepper
          steps={steps}
          orientation={stepperOrientation}
          linear={useLinearMode}
          alternativeLabel={useAlternativeLabel}
          allowSkip={allowStepSkip}
          onComplete={() => methods.handleSubmit(onSubmit)()}
          showStepNumbers
        />
      </FormProvider>

      {/* Display submitted data */}
      {formData && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Form successfully submitted!
          </Alert>
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
          }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </Box>
        </Paper>
      )}
    </Box>
  );
} 