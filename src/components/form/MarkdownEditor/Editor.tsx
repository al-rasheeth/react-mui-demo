import React from 'react';
import { Box } from '@mui/material';
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef: React.Ref<ReactCodeMirrorRef>;
  height: string;
  placeholder: string;
}

/**
 * Component for the markdown editor input
 */
const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  onBlur,
  inputRef,
  height,
  placeholder,
}) => {
  return (
    <Box sx={{ p: 0 }}>
      <ReactCodeMirror
        value={value || ''}
        onChange={onChange}
        height={height}
        onBlur={onBlur}
        ref={inputRef}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          autocompletion: false
        }}
      />
    </Box>
  );
};

export default Editor; 