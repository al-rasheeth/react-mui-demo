import { useState } from 'react';
import { Box, Paper, Stack, Button, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  TextField,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  DatePicker,
} from '../form';

type FormData = {
  name: string;
  email: string;
  country: string;
  subscribe: boolean;
  preferences: string;
  darkMode: boolean;
  birthDate: Date | null;
};

export function NonRHFExample() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    country: '',
    subscribe: false,
    preferences: '',
    darkMode: true,
    birthDate: null,
  });

  const [submitted, setSubmitted] = useState(false);

  // Options for select and radio inputs
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  const preferenceOptions = [
    { value: 'daily', label: 'Daily Updates' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'monthly', label: 'Monthly Newsletter' },
  ];

  const handleChange = (name: keyof FormData) => (value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      country: '',
      subscribe: false,
      preferences: '',
      darkMode: true,
      birthDate: null,
    });
    setSubmitted(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack spacing={3}>
            <TextField<FormData>
              name="name"
              label="Full Name"
              required
              rhfMode={false}
              value={formData.name}
              onChange={(e) => handleChange('name')(e.target.value)}
              helperText="Enter your full name"
            />

            <TextField<FormData>
              name="email"
              label="Email Address"
              type="email"
              required
              rhfMode={false}
              value={formData.email}
              onChange={(e) => handleChange('email')(e.target.value)}
              helperText="We'll never share your email"
            />

            <Select<FormData>
              name="country"
              label="Country"
              options={countryOptions}
              required
              rhfMode={false}
              value={formData.country}
              onChange={(e) => handleChange('country')(e.target.value)}
              helperText="Select your country"
            />

            <RadioGroup<FormData>
              name="preferences"
              label="Email Preferences"
              options={preferenceOptions}
              rhfMode={false}
              value={formData.preferences}
              onChange={(e) => handleChange('preferences')(e.target.value)}
              helperText="How often would you like to receive emails?"
            />

            <DatePicker<FormData>
              name="birthDate"
              label="Birth Date"
              rhfMode={false}
              value={formData.birthDate}
              onChange={(date) => handleChange('birthDate')(date)}
              helperText="Select your birth date"
            />

            <Checkbox<FormData>
              name="subscribe"
              label="Subscribe to newsletter"
              rhfMode={false}
              checked={formData.subscribe}
              onChange={(e) => handleChange('subscribe')(e.target.checked)}
              helperText="Receive our newsletter"
            />

            <Switch<FormData>
              name="darkMode"
              label="Enable dark mode"
              rhfMode={false}
              checked={formData.darkMode}
              onChange={(e) => handleChange('darkMode')(e.target.checked)}
              helperText="Toggle dark mode"
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                Submit
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </form>

      {submitted && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Submitted Data (Non-RHF Mode)
          </Typography>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </Paper>
      )}
    </LocalizationProvider>
  );
} 
 