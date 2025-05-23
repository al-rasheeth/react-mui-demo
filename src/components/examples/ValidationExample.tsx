import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Stack, Typography, Paper, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  FormProvider,
  TextField,
  Select,
  Checkbox,
  RadioGroup,
  DatePicker,
} from '../form';

// Define a more complex schema with conditional validation
const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  email: z.string().email('Invalid email format'),
  age: z.coerce.number().min(18, 'You must be at least 18 years old'),
  occupation: z.string().min(1, 'Occupation is required'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  dob: z.date().refine(
    (date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    },
    { message: 'You must be at least 18 years old' }
  ),
  preferredContact: z.string().min(1, 'Contact method is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export function ValidationExample() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      age: 18,
      occupation: '',
      termsAccepted: false,
      dob: undefined,
      preferredContact: '',
    },
    mode: 'onChange', // Validate on change for immediate feedback
  });

  const onSubmit = (data: FormValues) => {
    try {
      // Simulate server-side validation
      if (data.username === 'admin' && data.email === 'admin@example.com') {
        setError('This combination of username and email is already taken');
        return;
      }
      
      setFormData(data);
      setError(null);
      console.log('Form submitted:', data);
    } catch (err) {
      console.error('Submission error:', err);
      setError('An error occurred during form submission');
    }
  };

  // Options for select and radio inputs
  const occupationOptions = [
    { value: 'developer', label: 'Software Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Manager' },
    { value: 'student', label: 'Student' },
    { value: 'other', label: 'Other' },
  ];

  const contactOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'mail', label: 'Mail' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Stack spacing={3}>
            <TextField<FormValues>
              name="username"
              label="Username"
              required
              helperText="3-20 characters, letters, numbers, underscores only"
            />

            <TextField<FormValues>
              name="password"
              label="Password"
              type="password"
              required
              helperText="8+ chars with uppercase, lowercase, number, and special character"
            />

            <TextField<FormValues>
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              helperText="Repeat your password"
            />

            <TextField<FormValues>
              name="email"
              label="Email"
              type="email"
              required
            />

            <TextField<FormValues>
              name="age"
              label="Age"
              type="number"
              required
              helperText="Must be 18 or older"
            />

            <DatePicker<FormValues>
              name="dob"
              label="Date of Birth"
              required
              helperText="You must be at least 18 years old"
            />

            <Select<FormValues>
              name="occupation"
              label="Occupation"
              options={occupationOptions}
              required
            />

            <RadioGroup<FormValues>
              name="preferredContact"
              label="Preferred Contact Method"
              options={contactOptions}
              required
            />

            <Checkbox<FormValues>
              name="termsAccepted"
              label="I accept the terms and conditions"
              required
              helperText="You must accept the terms to continue"
            />

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
          </Stack>
        </FormProvider>
      </Paper>

      {formData && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Submitted Data (with Advanced Validation)
          </Typography>
          <pre>
            {JSON.stringify(
              {
                ...formData,
                dob: formData.dob ? formData.dob.toISOString().split('T')[0] : null,
              },
              null,
              2
            )}
          </pre>
        </Paper>
      )}
    </LocalizationProvider>
  );
} 