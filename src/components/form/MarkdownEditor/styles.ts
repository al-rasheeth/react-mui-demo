import { Paper, styled } from '@mui/material';

/**
 * Styled container for the markdown preview
 */
export const MarkdownPreviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: '600px',
  overflow: 'auto',
  '& img': {
    maxWidth: '100%'
  },
  '& pre': {
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto'
  },
  '& code': {
    backgroundColor: theme.palette.action.hover,
    padding: '2px 4px',
    borderRadius: 4,
    fontSize: '0.9em'
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.divider}`,
    margin: 0,
    paddingLeft: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  '& table': {
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1)
  },
  '& th': {
    backgroundColor: theme.palette.action.hover
  }
})); 