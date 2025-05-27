import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { TextField } from '@components/form/TextField';
import { Select } from '@components/form/Select';
import { FileUpload } from '@components/form/FileUpload';

interface ImportStepProps {
  importType: 'file' | 'url';
}

const ImportStep: React.FC<ImportStepProps> = ({ importType }) => {
  return (
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
  );
};

export default ImportStep; 