import { ToolbarOption } from './types';

/**
 * Default toolbar options for the markdown editor
 */
export const defaultToolbarOptions: ToolbarOption[] = [
  { label: 'Bold', prefix: '**', suffix: '**', example: 'bold text' },
  { label: 'Italic', prefix: '_', suffix: '_', example: 'italic text' },
  { label: 'Heading', prefix: '## ', suffix: '', example: 'Heading' },
  { label: 'Link', prefix: '[', suffix: '](url)', example: 'link text' },
  { label: 'Image', prefix: '![', suffix: '](url)', example: 'alt text' },
  { label: 'Code', prefix: '```\n', suffix: '\n```', example: 'code here' },
  { label: 'List', prefix: '- ', suffix: '', example: 'List item' },
  { label: 'Quote', prefix: '> ', suffix: '', example: 'Quote text' },
];

/**
 * Inserts or wraps text in the editor
 * 
 * @param fieldName - The name of the field
 * @param currentText - The current text in the editor
 * @param prefix - The prefix to add
 * @param suffix - The suffix to add
 * @param example - The example text to use if no text is selected
 * @returns The new text value
 */
export const insertMarkdownSyntax = (
  fieldName: string,
  currentText: string,
  prefix: string,
  suffix: string,
  example: string
): string => {
  const textarea = document.querySelector(`textarea[name="${fieldName}"]`) as HTMLTextAreaElement;
  if (!textarea) return currentText;
  
  const start = textarea.selectionStart || 0;
  const end = textarea.selectionEnd || 0;
  
  // If text is selected, wrap it with prefix and suffix
  // If not, insert example text
  const selectedText = currentText.substring(start, end);
  const replacement = selectedText || example;
  
  return (
    currentText.substring(0, start) + 
    prefix + replacement + suffix + 
    currentText.substring(end)
  );
};

/**
 * Sets the cursor position in the editor after inserting text
 * 
 * @param fieldName - The name of the field
 * @param position - The position to set the cursor
 */
export const setCursorPosition = (fieldName: string, position: number): void => {
  setTimeout(() => {
    const textarea = document.querySelector(`textarea[name="${fieldName}"]`) as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(position, position);
    }
  }, 0);
}; 