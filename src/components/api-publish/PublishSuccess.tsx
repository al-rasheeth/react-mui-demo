import React from 'react';
import { Box, Typography, Alert, Chip, Stack, Button } from '@mui/material';
import { PublishApiResponse } from '../../services/ApiPublishService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';

interface PublishSuccessProps {
  publishResult: PublishApiResponse;
  apiData: {
    category: string;
    service: string;
    version: string;
  };
  onReset: () => void;
}

const PublishSuccess: React.FC<PublishSuccessProps> = ({ publishResult, apiData, onReset }) => {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <CheckCircleIcon 
        color="success" 
        sx={{ fontSize: 60, mb: 2 }}
      />
      
      <Typography variant="h5" gutterBottom>
        API Published Successfully!
      </Typography>
      
      <Alert severity="success" sx={{ mb: 3 }}>
        {publishResult.message}
      </Alert>
      
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            API Details
          </Typography>
          
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            {publishResult.apiId && (
              <Chip label={`ID: ${publishResult.apiId}`} color="primary" />
            )}
            <Chip label={`Category: ${apiData.category}`} />
            <Chip label={`Service: ${apiData.service}`} />
            <Chip label={`Version: ${apiData.version}`} />
          </Stack>
        </Box>
      </Stack>
      
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/dashboard"
        >
          Back to Dashboard
        </Button>
        <Button 
          variant="contained" 
          onClick={onReset}
        >
          Publish Another API
        </Button>
      </Stack>
    </Box>
  );
};

export default PublishSuccess; 