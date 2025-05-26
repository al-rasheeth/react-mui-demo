import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  Button, 
  Stack, 
  Grid, 
  Typography, 
  Paper, 
  Divider, 
  Card, 
  CardContent, 
  CardActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  MobileStepper,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import {
  FormProvider,
  TextField,
  Select,
  Checkbox,
  RadioGroup,
  TextArea,
  DatePicker,
  Switch,
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

export function FormLayoutsExample() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [activeHorizontalStep, setActiveHorizontalStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

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
    setCompleted({
      ...completed,
      [activeHorizontalStep]: true,
    });
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

  // Steps for the stepper layout
  const steps = [
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
            <Switch<FormValues>
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
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepSubmit = () => {
    if (activeStep === steps.length - 1) {
      methods.handleSubmit(onSubmit)();
    } else {
      handleNext();
    }
  };

  // Horizontal stepper functions
  const handleHorizontalNext = () => {
    setActiveHorizontalStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleHorizontalBack = () => {
    setActiveHorizontalStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleHorizontalStep = (step: number) => () => {
    setActiveHorizontalStep(step);
  };

  const handleHorizontalComplete = () => {
    methods.handleSubmit((data) => {
      setFormData(data);
      const newCompleted = { ...completed };
      newCompleted[activeHorizontalStep] = true;
      setCompleted(newCompleted);
      
      // Check if form is completely filled
      const isLastStep = activeHorizontalStep === steps.length - 1;
      if (isLastStep) {
        onSubmit(data);
      } else {
        handleHorizontalNext();
      }
    })();
  };

  // Check if all steps are completed
  const isStepComplete = (step: number) => {
    return completed[step];
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Form Layouts Example
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* Two Column Layout */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Two Column Layout
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <TextField<FormValues>
                  name="firstName"
                  label="First Name"
                  required
                />
                <TextField<FormValues>
                  name="lastName"
                  label="Last Name"
                  required
                />
                <TextField<FormValues>
                  name="email"
                  label="Email"
                  required
                />
                <TextField<FormValues>
                  name="phone"
                  label="Phone"
                  required
                />
                <DatePicker<FormValues>
                  name="birthDate"
                  label="Birth Date"
                />
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h6" gutterBottom>
                  Address Information
                </Typography>
                <TextField<FormValues>
                  name="address"
                  label="Address"
                  required
                />
                <TextField<FormValues>
                  name="city"
                  label="City"
                  required
                />
                <TextField<FormValues>
                  name="state"
                  label="State/Province"
                  required
                />
                <TextField<FormValues>
                  name="zipCode"
                  label="Zip/Postal Code"
                  required
                />
                <Select<FormValues>
                  name="country"
                  label="Country"
                  options={countryOptions}
                  required
                />
              </Stack>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={methods.handleSubmit(onSubmit)}>
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Card Layout */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Card Layout
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Stack spacing={2}>
                    <TextField<FormValues>
                      name="firstName"
                      label="First Name"
                      required
                    />
                    <TextField<FormValues>
                      name="lastName"
                      label="Last Name"
                      required
                    />
                    <TextField<FormValues>
                      name="email"
                      label="Email"
                      required
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Address Information
                  </Typography>
                  <Stack spacing={2}>
                    <TextField<FormValues>
                      name="address"
                      label="Address"
                      required
                    />
                    <TextField<FormValues>
                      name="city"
                      label="City"
                      required
                    />
                    <Select<FormValues>
                      name="country"
                      label="Country"
                      options={countryOptions}
                      required
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Preferences
                  </Typography>
                  <Stack spacing={2}>
                    <RadioGroup<FormValues>
                      name="preferredContact"
                      label="Preferred Contact Method"
                      options={contactMethodOptions}
                      required
                    />
                    <Checkbox<FormValues>
                      name="receiveUpdates"
                      label="Receive updates"
                    />
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button variant="contained" onClick={methods.handleSubmit(onSubmit)}>
                    Submit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Vertical Stepper Layout */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Vertical Stepper Layout
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleStepSubmit}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Submit' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3, mt: 3, bgcolor: 'background.paper' }}>
              <Typography>All steps completed - Form has been submitted!</Typography>
              <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </Paper>

        {/* Horizontal Stepper Layout */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Horizontal Stepper Layout
          </Typography>
          <Stepper nonLinear activeStep={activeHorizontalStep} sx={{ mb: 3 }}>
            {steps.map((step, index) => (
              <Step key={step.label} completed={isStepComplete(index)}>
                <StepButton onClick={handleHorizontalStep(index)}>
                  {step.label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 2, mb: 1 }}>
            {steps[activeHorizontalStep].content}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeHorizontalStep === 0}
              onClick={handleHorizontalBack}
              sx={{ mr: 1 }}
              startIcon={<KeyboardArrowLeft />}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeHorizontalStep === steps.length - 1 ? (
              <Button 
                onClick={handleHorizontalComplete}
                variant="contained"
                endIcon={<KeyboardArrowRight />}
              >
                Finish
              </Button>
            ) : (
              <Button
                onClick={handleHorizontalComplete}
                variant="contained"
                endIcon={<KeyboardArrowRight />}
              >
                {isStepComplete(activeHorizontalStep) ? 'Next' : 'Complete Step'}
              </Button>
            )}
          </Box>
          
          {Object.keys(completed).length === steps.length && (
            <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.paper' }}>
              <Typography>All steps completed - Form has been submitted!</Typography>
              <Button 
                onClick={() => {
                  setActiveHorizontalStep(0);
                  setCompleted({});
                }} 
                sx={{ mt: 1 }}
              >
                Reset
              </Button>
            </Paper>
          )}
        </Paper>

        {/* Mobile Stepper Layout (Responsive) */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Mobile Stepper Layout
          </Typography>
          <Box sx={{ maxWidth: '100%', flexGrow: 1 }}>
            <Typography variant="h6" align="center" gutterBottom>
              {steps[activeHorizontalStep].label}
            </Typography>
            
            <Box sx={{ mt: 2, mb: 3 }}>
              {steps[activeHorizontalStep].content}
            </Box>
            
            <MobileStepper
              variant="dots"
              steps={steps.length}
              position="static"
              activeStep={activeHorizontalStep}
              sx={{ maxWidth: '100%', flexGrow: 1 }}
              nextButton={
                <Button
                  size="small"
                  onClick={activeHorizontalStep === steps.length - 1 ? handleHorizontalComplete : handleHorizontalNext}
                  disabled={activeHorizontalStep === steps.length}
                >
                  {activeHorizontalStep === steps.length - 1 ? 'Finish' : 'Next'}
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleHorizontalBack} disabled={activeHorizontalStep === 0}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Box>
        </Paper>
      </FormProvider>

      {/* Display submitted data */}
      {formData && (
        <Paper sx={{ p: 3, mt: 4 }}>
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