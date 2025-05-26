import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useStepperContext } from './useStepperContext';

interface CompletedViewProps {
  message?: string;
  resetButtonLabel?: string;
}

/**
 * Component displayed when all steps are completed
 */
const CompletedView: React.FC<CompletedViewProps> = ({
  message = 'All steps completed',
  resetButtonLabel = 'Reset'
}) => {
  const { handleReset } = useStepperContext();

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
      <Button 
        onClick={handleReset} 
        sx={{ mt: 1, mr: 1 }}
        startIcon={<RefreshIcon />}
      >
        {resetButtonLabel}
      </Button>
    </Box>
  );
};

export default CompletedView; 