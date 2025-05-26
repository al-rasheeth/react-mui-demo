import { ReactNode } from 'react';
import { FieldValues, UseControllerProps, Path } from 'react-hook-form';

/**
 * Field object passed to the render function
 */
export interface FormFieldRenderProps {
  field: { 
    value: unknown; 
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    ref: React.Ref<HTMLElement | null>;
    name: string;
  };
  fieldState: { 
    invalid: boolean; 
    error?: { message?: string };
  };
}

/**
 * Props for the FormField component
 */
export type FormFieldProps<T extends FieldValues> = {
  /** The name of the form field */
  name: Path<T>;
  /** Label for the field */
  label?: string;
  /** Helper text to display below the field */
  helperText?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Render function for the field */
  children: (props: FormFieldRenderProps) => ReactNode;
  /** Additional controller props from react-hook-form */
  controllerProps?: Omit<UseControllerProps<T>, 'name'>;
  /** Whether to use react-hook-form mode */
  rhfMode?: boolean;
};