import { ReactNode } from 'react';
import {
  FieldValues,
  FormProvider as RHFFormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

type FormProviderProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit?: SubmitHandler<T>;
  children: ReactNode;
};

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