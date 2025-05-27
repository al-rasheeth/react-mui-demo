import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { TextField } from '@components/form/TextField';
import { Select } from '@components/form/Select';
import { useFormContext, useWatch } from 'react-hook-form';

interface MetadataStepProps {
  serviceOptions: Array<{ value: string; label: string }>;
  category: string;
}

const MetadataStep: React.FC<MetadataStepProps> = ({ serviceOptions, category }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        API Metadata
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Select
            name="category"
            label="Category"
            options={[
              { value: 'finance', label: 'Finance' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'retail', label: 'Retail' },
              { value: 'technology', label: 'Technology' },
            ]}
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
  );
};

export default MetadataStep; 