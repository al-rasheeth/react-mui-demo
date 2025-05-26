import React from 'react';
import { 
  Box, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Typography 
} from '@mui/material';
import { VerticalStepperProps } from './types';
import { useStepperContext } from './StepperContext';
import StepActions from './StepActions';
import GlobalActions from './GlobalActions';

/**
 * Vertical layout for the form stepper
 */
const VerticalStepper: React.FC<VerticalStepperProps> = ({
  steps,
  activeStep,
  linear,
  stepperProps,
  showStepNumbers,
  nextButtonLabel,
  backButtonLabel,
  finishButtonLabel,
  allowSkip,
}) => {
  const {
    handleNext,
    handleBack,
    handleSkip,
    isStepOptional,
    isStepComplete,
    globalActions
  } = useStepperContext();

  return (
    <Stepper 
      activeStep={activeStep} 
      orientation="vertical"
      nonLinear={!linear}
      {...stepperProps}
    >
      {steps.map((step, index) => {
        const stepProps: { completed?: boolean; optional?: React.ReactNode } = {};
        
        if (isStepComplete(index)) {
          stepProps.completed = true;
        }
        
        if (isStepOptional(index)) {
          stepProps.optional = (
            <Typography variant="caption">
              {step.subLabel || 'Optional'}
            </Typography>
          );
        } else if (step.subLabel) {
          stepProps.optional = (
            <Typography variant="caption">{step.subLabel}</Typography>
          );
        }

        return (
          <Step key={step.label} {...stepProps}>
            <StepLabel 
              optional={stepProps.optional}
              StepIconProps={{
                icon: showStepNumbers ? index + 1 : undefined
              }}
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <GlobalActions actions={globalActions} />
              {step.content}
              <StepActions actions={step.actions || []} />
              <Box sx={{ mb: 2, mt: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? finishButtonLabel : nextButtonLabel}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {backButtonLabel}
                  </Button>
                  {isStepOptional(index) && allowSkip && (
                    <Button 
                      color="inherit" 
                      onClick={handleSkip} 
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Skip
                    </Button>
                  )}
                </div>
              </Box>
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default VerticalStepper; 