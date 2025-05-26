import React from 'react';
import { Box, Button, ButtonGroup, Tooltip, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { GlobalActionsProps } from './types';
import { useStepperContext } from './useStepperContext';

/**
 * Component to render global action buttons that appear on all steps
 */
const GlobalActions = ({ actions = [] }: { actions?: GlobalActionsProps['actions'] }): React.ReactElement | null => {
  const { lastAutoSave, handleSave } = useStepperContext();

  if (actions.length === 0 && !handleSave) return null;

  return (
    <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
      {lastAutoSave && (
        <Typography variant="caption" sx={{ mr: 2, alignSelf: 'center', color: 'text.secondary' }}>
          Last saved: {lastAutoSave.toLocaleTimeString()}
        </Typography>
      )}
      
      <ButtonGroup size="small" variant="outlined">
        {handleSave && (
          <Tooltip title="Save changes" arrow>
            <Button
              onClick={handleSave}
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </Tooltip>
        )}
        
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

export default GlobalActions; 