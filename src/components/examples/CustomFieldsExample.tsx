import { useState } from 'react';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Rating,
  Slider,
  Chip,
  InputAdornment,
  IconButton,
  TextField as MuiTextField,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  FormProvider,
  TextField,
  FormField,
} from '../form';

// Custom components using FormField
const RatingField = <T extends Record<string, any>>({
  name,
  label,
  helperText,
  required,
  max = 5,
  ...rest
}: {
  name: Path<T>;
  label?: string;
  helperText?: string;
  required?: boolean;
  max?: number;
}) => {
  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
    >
      {({ field, fieldState }) => (
        <Rating
          {...field}
          max={max}
          onChange={(_, value) => field.onChange(value)}
          precision={0.5}
        />
      )}
    </FormField>
  );
};

const SliderField = <T extends Record<string, any>>({
  name,
  label,
  helperText,
  required,
  min = 0,
  max = 100,
  step = 1,
  ...rest
}: {
  name: Path<T>;
  label?: string;
  helperText?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}) => {
  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
    >
      {({ field, fieldState }) => (
        <>
          <Slider
            {...field}
            min={min}
            max={max}
            step={step}
            valueLabelDisplay="auto"
            onChange={(_, value) => field.onChange(value)}
          />
          <Typography variant="caption" color="text.secondary">
            Current value: {field.value}
          </Typography>
        </>
      )}
    </FormField>
  );
};

const TagsField = <T extends Record<string, any>>({
  name,
  label,
  helperText,
  required,
  ...rest
}: {
  name: Path<T>;
  label?: string;
  helperText?: string;
  required?: boolean;
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
    >
      {({ field, fieldState }) => {
        const handleDelete = (tag: string) => {
          const newValue = (field.value as string[]).filter((t) => t !== tag);
          field.onChange(newValue);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!(field.value as string[]).includes(newTag)) {
              const newValue = [...(field.value as string[]), newTag];
              field.onChange(newValue);
            }
            setInputValue('');
          }
        };

        return (
          <div>
            <MuiTextField
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type and press Enter to add tags"
              error={fieldState.invalid}
              helperText={fieldState.error ? fieldState.error.message : helperText}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {(field.value as string[]).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDelete(tag)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </div>
        );
      }}
    </FormField>
  );
};

const PasswordField = <T extends Record<string, any>>({
  name,
  label,
  helperText,
  required,
  ...rest
}: {
  name: Path<T>;
  label?: string;
  helperText?: string;
  required?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <FormField<T>
      name={name}
      label={label}
      helperText={helperText}
      required={required}
    >
      {({ field, fieldState }) => (
        <MuiTextField
          {...field}
          type={visible ? 'text' : 'password'}
          fullWidth
          error={fieldState.invalid}
          helperText={fieldState.error ? fieldState.error.message : helperText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleVisibility}
                  edge="end"
                >
                  {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    </FormField>
  );
};

// Define the form schema
const formSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters'),
  rating: z.number().min(1, 'Please provide a rating'),
  price: z.number().min(1, 'Price must be at least 1'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.array(z.string()).min(1, 'Add at least one tag'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export function CustomFieldsExample() {
  const [formData, setFormData] = useState<FormValues | null>(null);

  // Initialize form with react-hook-form
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      rating: 0,
      price: 50,
      description: '',
      tags: [],
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setFormData(data);
    console.log('Form submitted:', data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <TextField<FormValues>
              name="productName"
              label="Product Name"
              required
            />

            <Typography variant="subtitle1" gutterBottom>
              Product Rating
            </Typography>
            <RatingField<FormValues>
              name="rating"
              helperText="Rate the product from 1 to 5 stars"
              required
            />

            <Typography variant="subtitle1" gutterBottom>
              Price ($)
            </Typography>
            <SliderField<FormValues>
              name="price"
              min={1}
              max={1000}
              step={1}
              helperText="Set the product price"
              required
            />

            <TextField<FormValues>
              name="description"
              label="Product Description"
              multiline
              rows={4}
              required
            />

            <Typography variant="subtitle1" gutterBottom>
              Product Tags
            </Typography>
            <TagsField<FormValues>
              name="tags"
              helperText="Add tags that describe the product"
              required
            />

            <Typography variant="subtitle1" gutterBottom>
              Secure Password
            </Typography>
            <PasswordField<FormValues>
              name="password"
              helperText="Enter a secure password"
              required
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                Submit
              </Button>
              <Button
                variant="outlined"
                onClick={() => methods.reset()}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      </Paper>

      {formData && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Submitted Data (Custom Fields)
          </Typography>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </Paper>
      )}
    </LocalizationProvider>
  );
} 