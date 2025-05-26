import React from 'react';
import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownPreviewContainer } from './styles';

interface PreviewProps {
  content: string;
}

/**
 * Component for rendering the markdown preview
 */
const Preview: React.FC<PreviewProps> = ({ content }) => {
  return (
    <MarkdownPreviewContainer>
      {content ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      ) : (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Nothing to preview yet
        </Typography>
      )}
    </MarkdownPreviewContainer>
  );
};

export default Preview; 