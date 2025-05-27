import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OasValidationResult } from '@utils/oasValidation';
import { ApiPublishService, PublishApiResponse } from '../services/ApiPublishService';

// Form schema with validation
export const apiPublishSchema = z.object({
  // Step 1: Metadata
  category: z.string().min(1, 'Category is required'),
  service: z.string().min(1, 'Service is required'),
  version: z.string().min(1, 'Version is required')
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format x.y.z'),
  description: z.string().optional(),
  
  // Step 2: Import
  importType: z.enum(['file', 'url']),
  fileSource: z.instanceof(File).optional().nullable(),
  urlSource: z.string().url('Please enter a valid URL').optional().nullable(),
}).refine(
  (data) => {
    // Ensure either fileSource or urlSource is provided based on importType
    if (data.importType === 'file') {
      return !!data.fileSource;
    } else {
      return !!data.urlSource;
    }
  },
  {
    message: 'Please provide either a file or URL based on the import type',
    path: ['fileSource'],
  }
);

export type ApiPublishFormValues = z.infer<typeof apiPublishSchema>;

// Categories and their services
export const categories = [
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'technology', label: 'Technology' },
];

export const services = {
  finance: [
    { value: 'payment', label: 'Payment Processing' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'banking', label: 'Banking' },
  ],
  healthcare: [
    { value: 'patient', label: 'Patient Records' },
    { value: 'appointment', label: 'Appointment Scheduling' },
    { value: 'billing', label: 'Medical Billing' },
  ],
  retail: [
    { value: 'inventory', label: 'Inventory Management' },
    { value: 'order', label: 'Order Processing' },
    { value: 'shipping', label: 'Shipping' },
  ],
  technology: [
    { value: 'cloud', label: 'Cloud Services' },
    { value: 'ai', label: 'AI & Machine Learning' },
    { value: 'iot', label: 'IoT' },
  ],
};

// Hook for managing the API publish form
export function useApiPublish() {
  // Form setup with validation
  const methods = useForm<ApiPublishFormValues>({
    resolver: zodResolver(apiPublishSchema),
    defaultValues: {
      category: '',
      service: '',
      version: '',
      importType: 'file',
      fileSource: null,
      urlSource: null,
      description: '',
    },
    mode: 'onChange',
  });

  // Get form values and methods
  const { watch, setValue, getValues, handleSubmit } = methods;
  const category = watch('category');
  const importType = watch('importType');

  // State management
  const [serviceOptions, setServiceOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<OasValidationResult | null>(null);
  const [publishResult, setPublishResult] = useState<PublishApiResponse | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [oasDocument, setOasDocument] = useState<any | null>(null);

  // Update service options when category changes
  useEffect(() => {
    if (category) {
      setServiceOptions(services[category as keyof typeof services] || []);
      // Reset service selection when category changes
      setValue('service', '');
    }
  }, [category, setValue]);

  // Handle validation
  const handleValidate = async () => {
    const values = getValues();
    setIsValidating(true);
    setValidationResult(null);
    setOasDocument(null);
    
    try {
      const source = values.importType === 'file' ? values.fileSource : values.urlSource;
      if (!source) {
        throw new Error('Please provide a valid file or URL');
      }
      
      const result = await ApiPublishService.validateSpec(source);
      setValidationResult(result);
      if (result.document) {
        setOasDocument(result.document);
      }
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        valid: false,
        errors: [{ 
          path: '/', 
          message: error instanceof Error ? error.message : 'Unknown validation error' 
        }],
        stats: {
          endpoints: 0,
          schemas: 0,
          version: 'unknown',
        },
      });
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  // Handle form submission
  const handlePublish = async () => {
    // Run validation first
    const validationResult = await handleValidate();
    if (!validationResult?.valid) {
      return false;
    }
    
    const values = getValues();
    setIsPublishing(true);
    
    try {
      const response = await ApiPublishService.publishApi({
        category: values.category,
        service: values.service,
        version: values.version,
        description: values.description,
        specSource: values.importType === 'file' ? values.fileSource! : values.urlSource!,
      });
      
      setPublishResult(response);
      return response.success;
    } catch (error) {
      console.error('Error publishing API:', error);
      setPublishResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    methods,
    serviceOptions,
    category,
    importType,
    isValidating,
    validationResult,
    isPublishing,
    publishResult,
    oasDocument,
    handleValidate,
    handlePublish,
  };
} 