import React from 'react';
import { Box, Typography } from '@mui/material';
import { ToolbarOption } from './types';

interface ToolbarProps {
  options: ToolbarOption[];
  onOptionClick: (prefix: string, suffix: string, example: string) => void;
}

/**
 * Toolbar component with formatting options for the markdown editor
 */
const Toolbar: React.FC<ToolbarProps> = ({ options, onOptionClick }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        p: 1, 
        borderBottom: 1, 
        borderColor: 'divider' 
      }}
    >
      {options.map((option) => (
        <Typography
          key={option.label}
          component="span"
          variant="body2"
          sx={{ 
            px: 1, 
            py: 0.5, 
            bgcolor: 'action.hover', 
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.selected' }
          }}
          onClick={() => onOptionClick(option.prefix, option.suffix, option.example)}
        >
          {option.label}
        </Typography>
      ))}
    </Box>
  );
};

export default Toolbar; 