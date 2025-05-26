import React, { ChangeEvent, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import { FormField } from '../FormField';
import { FileUploadProps } from './types';
import { validateFile } from './utils';
import Dropzone from './Dropzone';
import FileList from './FileList';

/**
 * A file upload component with drag and drop support
 */
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
              return validateFile(file, accept, maxSize);
            });
            
            field.onChange([...files, ...validFiles]);
          } else {
            const file = fileList[0];
            if (validateFile(file, accept, maxSize)) {
              field.onChange(file);
            }
          }
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

        return (
          <>
            <Dropzone 
              name={name}
              dragActive={dragActive}
              fieldError={fieldState.invalid}
              accept={accept}
              multiple={multiple}
              buttonLabel={buttonLabel}
              dropzoneLabel={dropzoneLabel}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onChange={handleChange}
              inputRef={field.ref}
            />
            
            <FileList 
              files={files}
              multiple={multiple}
              onRemove={removeFile}
            />
            
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