import { ReactNode } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

/**
 * Props for the FormProvider component
 */
export type FormProviderProps<T extends FieldValues> = {
  /** Form methods from react-hook-form */
  methods: UseFormReturn<T>;
  /** Form submission handler */
  onSubmit?: SubmitHandler<T>;
  /** Child components */
  children: ReactNode;
}; 