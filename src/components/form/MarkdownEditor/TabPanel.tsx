import React from 'react';
import { Box } from '@mui/material';
import { TabPanelProps } from './types';

/**
 * Component for the tab panels in the markdown editor
 */
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`markdown-tabpanel-${index}`}
      aria-labelledby={`markdown-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TabPanel; 