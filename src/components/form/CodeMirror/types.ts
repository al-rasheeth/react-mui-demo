import { FieldValues, Path } from 'react-hook-form';
import { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { FormFieldProps } from '../FormField';

/**
 * Props for the CodeMirror component
 */
export type CodeMirrorProps<T extends FieldValues> = Omit<
  ReactCodeMirrorProps,
  'value' | 'onChange'
> &
  Omit<FormFieldProps<T>, 'children'> & {
    /** The name of the form field */
    name: Path<T>;
    /** Height of the editor */
    height?: string;
    /** Programming language for syntax highlighting */
    language?: 'javascript' | 'typescript' | 'json' | 'plain';
  }; 