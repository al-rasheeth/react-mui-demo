import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface FileListProps {
  files: File | File[] | null;
  multiple: boolean;
  onRemove: (index: number) => void;
}

/**
 * Component to display a list of uploaded files with delete buttons
 */
const FileList: React.FC<FileListProps> = ({ files, multiple, onRemove }) => {
  if (!files || (Array.isArray(files) && files.length === 0)) {
    return null;
  }

  if (multiple && Array.isArray(files)) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Selected Files:
        </Typography>
        {files.map((file: File, index: number) => (
          <Stack 
            key={`${file.name}-${index}`} 
            direction="row" 
            spacing={1} 
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
              {file.name}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => onRemove(index)}
              aria-label={`Remove ${file.name}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Box>
    );
  } else {
    const file = files as File;
    return (
      <Box sx={{ mt: 2 }}>
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center"
        >
          <Typography variant="body2" noWrap sx={{ flex: 1 }}>
            {file.name}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => onRemove(0)}
            aria-label={`Remove ${file.name}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    );
  }
};

export default FileList; 