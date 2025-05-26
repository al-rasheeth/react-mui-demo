import { ChangeEvent, useState } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import {
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  FormHelperText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormField, FormFieldProps } from './FormField';

export type FileUploadProps<T extends FieldValues> = Omit<FormFieldProps<T>, 'children'> & {
  name: Path<T>;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  buttonLabel?: string;
  dropzoneLabel?: string;
};

export function FileUpload<T extends FieldValues>({
  name,
  label,
  helperText,
  required,
  accept,
  maxSize,
  multiple = false,
  buttonLabel = 'Choose File',
  dropzoneLabel = 'Drag and drop files here or click to browse',
  controllerProps,
  rhfMode = true,
}: FileUploadProps<T>) {
  const [dragActive, setDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      controllerProps={controllerProps}
      rhfMode={rhfMode}
    >
      {({ field, fieldState }) => {
        const files = field.value || (multiple ? [] : null);

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        };
        
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        };
        
        const handleFiles = (fileList: FileList) => {
          if (multiple) {
            const newFiles = Array.from(fileList);
            const validFiles = newFiles.filter(file => {
              return validateFile(file);
            });
            
            field.onChange([...files, ...validFiles]);
          } else {
            const file = fileList[0];
            if (validateFile(file)) {
              field.onChange(file);
            }
          }
        };
        
        const validateFile = (file: File): boolean => {
          // Validate file type if accept is provided
          if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim());
            const fileType = file.type;
            const fileExtension = '.' + file.name.split('.').pop();
            
            if (!acceptedTypes.some(type => 
              type === fileType || type === fileExtension || type === '*/*'
            )) {
              // You could trigger a notification or add to error state here
              return false;
            }
          }
          
          // Validate file size if maxSize is provided
          if (maxSize && file.size > maxSize) {
            // You could trigger a notification or add to error state here
            return false;
          }
          
          return true;
        };
        
        const removeFile = (index: number) => {
          if (multiple) {
            const updatedFiles = [...files];
            updatedFiles.splice(index, 1);
            field.onChange(updatedFiles);
          } else {
            field.onChange(null);
          }
        };

        const renderFileList = () => {
          if (!files || (Array.isArray(files) && files.length === 0)) {
            return null;
          }

          if (multiple) {
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
                      onClick={() => removeFile(index)}
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
                    onClick={() => removeFile(0)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            );
          }
        };

        return (
          <>
            <Box
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                border: '2px dashed',
                borderColor: dragActive 
                  ? 'primary.main' 
                  : fieldState.invalid 
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
                onChange={handleChange}
                style={{ display: 'none' }}
                ref={field.ref}
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
            
            {renderFileList()}
            
            {fieldState.invalid && fieldState.error ? (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            ) : helperText ? (
              <FormHelperText>{helperText}</FormHelperText>
            ) : null}
          </>
        );
      }}
    </FormField>
  );
} 