import React from 'react';
import { FieldValues, FormProvider as RHFFormProvider } from 'react-hook-form';
import { FormProviderProps } from './types';

/**
 * A wrapper around react-hook-form's FormProvider that automatically handles form submission
 */
export function FormProvider<T extends FieldValues>({
  methods,
  onSubmit,
  children,
}: FormProviderProps<T>) {
  const handleSubmit = onSubmit ? methods.handleSubmit(onSubmit) : undefined;

  return (
    <RHFFormProvider {...methods}>
      {handleSubmit ? (
        <form onSubmit={handleSubmit} noValidate>
          {children}
        </form>
      ) : (
        children
      )}
    </RHFFormProvider>
  );
} 