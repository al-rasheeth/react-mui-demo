# React Hook Form + MUI Components

A collection of form components that integrate [React Hook Form](https://react-hook-form.com/) with [Material UI](https://mui.com/) components, following best practices.

## Features

- Type-safe form handling with TypeScript
- Validation using schema-based validation libraries (e.g., Zod)
- Support for both React Hook Form mode and standalone mode
- Consistent error handling and styling
- All MUI components styled according to Material Design principles

## Components

### FormProvider

A wrapper around React Hook Form's `FormProvider` that provides form context to all child components.

```tsx
<FormProvider methods={methods} onSubmit={handleSubmit}>
  {/* Form fields */}
</FormProvider>
```

### TextField

A text input component that supports validation and error states.

```tsx
<TextField<FormValues>
  name="email"
  label="Email"
  required
  helperText="Enter your email address"
/>
```

### Select

A dropdown selection component.

```tsx
<Select<FormValues>
  name="country"
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
  ]}
  required
/>
```

### Checkbox

A checkbox component.

```tsx
<Checkbox<FormValues>
  name="acceptTerms"
  label="I accept the terms and conditions"
  required
/>
```

### Switch

A toggle switch component.

```tsx
<Switch<FormValues>
  name="notifications"
  label="Enable notifications"
/>
```

### RadioGroup

A group of radio buttons.

```tsx
<RadioGroup<FormValues>
  name="gender"
  label="Gender"
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]}
  required
/>
```

### DatePicker

A date picker component.

```tsx
<DatePicker<FormValues>
  name="birthDate"
  label="Birth Date"
/>
```

## Usage with React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormProvider, TextField, Select } from './form';

// Define your form schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  // Add more fields as needed
});

type FormValues = z.infer<typeof formSchema>;

function MyForm() {
  // Initialize form with react-hook-form
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <TextField<FormValues> name="name" label="Name" required />
      <TextField<FormValues> name="email" label="Email" required />
      <Button type="submit">Submit</Button>
    </FormProvider>
  );
}
```

## Usage without React Hook Form

All components support a `rhfMode={false}` prop to use them without React Hook Form:

```tsx
<TextField<FormValues>
  name="name"
  label="Name"
  rhfMode={false}
  onChange={(e) => handleChange(e.target.value)}
/>
```

## Best Practices

1. Always specify the generic type parameter to ensure type safety
2. Use schema validation (Zod, Yup, etc.) for form validation
3. Provide default values for all form fields
4. Use the `required` prop to indicate required fields
5. Provide helpful error messages in your validation schema 