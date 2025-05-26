import { FieldValues, Path } from 'react-hook-form';
import { FormFieldProps } from '../FormField';

export type MarkdownEditorProps<T extends FieldValues> = Omit<FormFieldProps<T>, 'children'> & {
  /** The name of the form field */
  name: Path<T>;
  /** Height of the editor */
  height?: string;
  /** Placeholder text for the editor */
  placeholder?: string;
  /** Whether to show the formatting toolbar */
  showToolbar?: boolean;
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ToolbarOption {
  label: string;
  prefix: string;
  suffix: string;
  example: string;
} 