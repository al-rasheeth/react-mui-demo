import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Stack, Typography, Paper, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  FormProvider,
  TextField,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  DatePicker,
} from '../form';

// Define the form schema with Zod for validation
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old'),
  gender: z.string().min(1, 'Gender is required'),
  city: z.string().min(1, 'City is required'),
  receiveEmails: z.boolean(),
  newsLetter: z.boolean(),
  birthDate: z.date().optional(),
});

// Infer the TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>;

export function SampleForm() {
  const [formData, setFormData] = useState<FormValues | null>(null);

  // Initialize form with react-hook-form
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18,
      gender: '',
      city: '',
      receiveEmails: false,
      newsLetter: true,
      birthDate: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    setFormData(data);
    console.log('Form submitted:', data);
  };

  // Example options for select and radio inputs
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const cityOptions = [
    { value: 'new_york', label: 'New York' },
    { value: 'london', label: 'London' },
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'paris', label: 'Paris' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ px: 4, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sample Form
        </Typography>

        {/* RHF Mode (with react-hook-form) */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            With React Hook Form
          </Typography>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField<FormValues>
                  name="name"
                  label="Full Name"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField<FormValues>
                  name="email"
                  label="Email"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField<FormValues>
                  name="age"
                  label="Age"
                  type="number"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Select<FormValues>
                  name="gender"
                  label="Gender"
                  options={genderOptions}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RadioGroup<FormValues>
                  name="city"
                  label="City"
                  options={cityOptions}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker<FormValues>
                  name="birthDate"
                  label="Birth Date"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Checkbox<FormValues>
                  name="receiveEmails"
                  label="Receive marketing emails"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Switch<FormValues>
                  name="newsLetter"
                  label="Subscribe to newsletter"
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => methods.reset()}
                  >
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Paper>

        {/* Non-RHF Mode */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Without React Hook Form
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField<FormValues>
                name="name"
                label="Full Name"
                required
                rhfMode={false}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Select<FormValues>
                name="gender"
                label="Gender"
                options={genderOptions}
                required
                rhfMode={false}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Checkbox<FormValues>
                name="receiveEmails"
                label="Receive marketing emails"
                rhfMode={false}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Display submitted data */}
        {formData && (
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Submitted Data
            </Typography>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
} 