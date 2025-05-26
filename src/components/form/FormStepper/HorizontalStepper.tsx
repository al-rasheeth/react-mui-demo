import React from 'react';
import { 
  Box, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepButton, 
  Typography 
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { HorizontalStepperProps } from './types';
import { useStepperContext } from './StepperContext';
import StepActions from './StepActions';
import GlobalActions from './GlobalActions';

/**
 * Horizontal layout for the form stepper
 */
const HorizontalStepper: React.FC<HorizontalStepperProps> = ({
  steps,
  activeStep,
  alternativeLabel,
  linear,
  stepperProps,
  showStepNumbers,
  completedStepIcon,
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
    <>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel={alternativeLabel}
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
              {linear ? (
                <StepLabel 
                  optional={stepProps.optional}
                  StepIconProps={{
                    icon: showStepNumbers ? index + 1 : undefined
                  }}
                >
                  {step.label}
                </StepLabel>
              ) : (
                <StepButton 
                  onClick={() => step.onActivate?.()}
                  optional={stepProps.optional}
                >
                  {step.label}
                </StepButton>
              )}
            </Step>
          );
        })}
      </Stepper>

      <GlobalActions actions={globalActions} />

      <Box sx={{ mt: 2, mb: 1 }}>
        {steps[activeStep]?.content}
      </Box>

      <StepActions actions={steps[activeStep]?.actions || []} />

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          startIcon={<KeyboardArrowLeft />}
        >
          {backButtonLabel}
        </Button>
        
        <Box sx={{ flex: '1 1 auto' }} />
        
        {isStepOptional(activeStep) && allowSkip && (
          <Button 
            color="inherit" 
            onClick={handleSkip} 
            sx={{ mr: 1 }}
          >
            Skip
          </Button>
        )}

        <Button
          onClick={handleNext}
          variant="contained"
          endIcon={<KeyboardArrowRight />}
        >
          {activeStep === steps.length - 1 ? finishButtonLabel : nextButtonLabel}
        </Button>
      </Box>
    </>
  );
};

export default HorizontalStepper; 