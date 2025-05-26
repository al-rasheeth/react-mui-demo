import { Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';

/**
 * Gets the appropriate language extension for CodeMirror based on the specified language
 * 
 * @param language - The language to get the extension for
 * @returns The CodeMirror language extension
 */
export const getLanguageExtension = (language: string): Extension => {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'typescript':
      return javascript({ typescript: true });
    case 'json':
      return javascript({ jsx: false });
    case 'plain':
    default:
      return [] as unknown as Extension;
  }
}; 