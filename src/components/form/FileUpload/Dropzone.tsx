import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface DropzoneProps {
  name: string;
  dragActive: boolean;
  fieldError: boolean;
  accept?: string;
  multiple?: boolean;
  buttonLabel: string;
  dropzoneLabel: string;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.Ref<HTMLInputElement>;
}

/**
 * Component for the drag and drop file upload zone
 */
const Dropzone: React.FC<DropzoneProps> = ({
  name,
  dragActive,
  fieldError,
  accept,
  multiple = false,
  buttonLabel,
  dropzoneLabel,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onChange,
  inputRef,
}) => {
  return (
    <Box
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        border: '2px dashed',
        borderColor: dragActive 
          ? 'primary.main' 
          : fieldError
            ? 'error.main' 
            : 'divider',
        borderRadius: 1,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: dragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        style={{ display: 'none' }}
        ref={inputRef}
      />
      <label htmlFor={name} style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'block' }}>
        <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
        <Typography>{dropzoneLabel}</Typography>
        <Button
          variant="contained"
          component="span"
          sx={{ mt: 2 }}
        >
          {buttonLabel}
        </Button>
      </label>
    </Box>
  );
};

export default Dropzone; 