import React from 'react';
import { Box, Button, ButtonGroup, Tooltip } from '@mui/material';
import { StepActionsProps } from './types';

/**
 * Component to render the action buttons for a form step
 */
const StepActions = ({ actions }: StepActionsProps): React.ReactElement | null => {
  if (actions.length === 0) return null;

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
      <ButtonGroup size="small" variant="outlined">
        {actions.map((action, idx) => (
          <Tooltip key={idx} title={action.tooltip || ''} arrow>
            <Button
              onClick={action.onClick}
              color={action.color || 'primary'}
              variant={action.variant || 'outlined'}
              disabled={action.disabled}
              startIcon={action.icon}
            >
              {action.label}
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default StepActions; 