import React from 'react';
import { Box, Typography, Stack, Alert, Chip, Button, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { OasValidationResult } from '../../utils/oasValidation';

interface ValidationStepProps {
  isValidating: boolean;
  validationResult: OasValidationResult | null;
  onValidate: () => void;
}

const ValidationStep: React.FC<ValidationStepProps> = ({ 
  isValidating, 
  validationResult, 
  onValidate 
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Validation & Publication
      </Typography>
      
      {isValidating ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
          <CircularProgress size={24} />
          <Alert severity="info">Validating API specification...</Alert>
        </Box>
      ) : validationResult ? (
        <Stack spacing={3}>
          <Alert 
            severity={validationResult.valid ? "success" : "warning"}
            variant="filled"
          >
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
                    <Typography variant="body2">
                      <strong>{error.path}</strong>: {error.message}
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      ) : (
        <Stack spacing={2} alignItems="flex-start">
          <Alert severity="info">
            Click "Validate" to check your API specification.
          </Alert>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onValidate}
            startIcon={<PlayArrowIcon />}
          >
            Validate
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ValidationStep; 