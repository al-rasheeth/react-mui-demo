import React, { useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { FormStepper } from '@components/form/FormStepper';
import { FormProvider } from '@components/form/FormProvider';
import { FormStepProps } from '@components/form/FormStepper/types';
import { MetadataStep, ImportStep, ValidationStep, PublishSuccess } from '@components/api-publish';
import { useApiPublish, ApiPublishFormValues } from '../hooks/useApiPublish';

const ApiPublishPage: React.FC = () => {
  const [publishComplete, setPublishComplete] = useState(false);
  const [formData, setFormData] = useState<ApiPublishFormValues | null>(null);
  
  const {
    methods,
    serviceOptions,
    category,
    importType,
    isValidating,
    validationResult,
    publishResult,
    handleValidate,
    handlePublish,
  } = useApiPublish();

  // Reset the form and state
  const handleReset = () => {
    methods.reset();
    setPublishComplete(false);
  };

  // Define the steps for the form stepper
  const steps: FormStepProps[] = [
    {
      label: 'Metadata',
      content: (
        <MetadataStep
          serviceOptions={serviceOptions}
          category={category}
        />
      ),
    },
    {
      label: 'Import',
      content: (
        <ImportStep 
          importType={importType}
        />
      ),
    },
    {
      label: 'Validate & Publish',
      content: (
        <ValidationStep
          isValidating={isValidating}
          validationResult={validationResult}
          onValidate={handleValidate}
        />
      ),
      actions: [
        {
          label: 'Validate',
          onClick: handleValidate,
          variant: 'outlined',
          color: 'primary',
        }
      ],
      validationHandler: async () => {
        // Only allow proceeding if validation was successful
        return !!validationResult?.valid;
      }
    }
  ];

  // Handle completion of the form
  const handleComplete = async () => {
    const values = methods.getValues();
    setFormData(values);
    
    // Call the publish API
    const success = await handlePublish();
    if (success) {
      setPublishComplete(true);
    }
    
    return success;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Publish API
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Use this wizard to publish your OpenAPI specification
      </Typography>
      
      {publishComplete && publishResult && formData ? (
        <Paper sx={{ p: 3, width: '100%' }}>
          <PublishSuccess 
            publishResult={publishResult}
            apiData={{
              category: formData.category,
              service: formData.service,
              version: formData.version,
            }}
            onReset={handleReset}
          />
        </Paper>
      ) : (
        <FormProvider methods={methods}>
          <FormStepper
            steps={steps}
            onComplete={handleComplete}
            finishButtonLabel="Publish"
            linear={true}
            requireAllStepsComplete={true}
          />
        </FormProvider>
      )}
    </Container>
  );
};

export default ApiPublishPage; 