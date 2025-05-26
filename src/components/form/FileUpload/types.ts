import { FieldValues, Path } from 'react-hook-form';
import { FormFieldProps } from '../FormField';

export type FileUploadProps<T extends FieldValues> = Omit<FormFieldProps<T>, 'children'> & {
  /** The name of the form field */
  name: Path<T>;
  /** File types to accept, e.g. '.jpg,.png' */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Whether to allow multiple file uploads */
  multiple?: boolean;
  /** Label for the upload button */
  buttonLabel?: string;
  /** Label for the dropzone area */
  dropzoneLabel?: string;
}; 