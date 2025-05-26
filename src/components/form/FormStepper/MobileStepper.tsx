import React from 'react';
import { 
  Box, 
  Button, 
  MobileStepper as MuiMobileStepper, 
  Typography 
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { MobileStepperProps } from './types';
import { useStepperContext } from './useStepperContext';
import StepActions from './StepActions';
import GlobalActions from './GlobalActions';

/**
 * Mobile-friendly layout for the form stepper
 */
const MobileStepper: React.FC<MobileStepperProps> = ({
  steps,
  activeStep,
  mobileStepperVariant,
  mobileStepperPosition,
  nextButtonLabel,
  backButtonLabel,
  finishButtonLabel,
}) => {
  const { handleNext, handleBack, globalActions } = useStepperContext();

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        {steps[activeStep]?.label}
      </Typography>
      
      {steps[activeStep]?.subLabel && (
        <Typography variant="caption" align="center" display="block" gutterBottom>
          {steps[activeStep].subLabel}
        </Typography>
      )}
      
      <GlobalActions actions={globalActions} />
      
      {/* Mobile stepper in top position */}
      {mobileStepperPosition === 'top' && (
        <MuiMobileStepper
          variant={mobileStepperVariant}
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          sx={{ maxWidth: '100%', flexGrow: 1, mb: 2 }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === steps.length}
            >
              {activeStep === steps.length - 1 ? finishButtonLabel : nextButtonLabel}
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button 
              size="small" 
              onClick={handleBack} 
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
              {backButtonLabel}
            </Button>
          }
        />
      )}
      
      {/* Content is always in the middle */}
      <Box sx={{ mt: 2, mb: 3 }}>
        {steps[activeStep]?.content}
      </Box>
      
      <StepActions actions={steps[activeStep]?.actions || []} />
      
      {/* Mobile stepper in bottom or static position */}
      {(mobileStepperPosition === 'bottom' || mobileStepperPosition === 'static') && (
        <MuiMobileStepper
          variant={mobileStepperVariant}
          steps={steps.length}
          position={mobileStepperPosition === 'bottom' ? 'static' : mobileStepperPosition}
          activeStep={activeStep}
          sx={{ 
            maxWidth: '100%', 
            flexGrow: 1,
            mt: mobileStepperPosition === 'bottom' ? 2 : 0
          }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === steps.length}
            >
              {activeStep === steps.length - 1 ? finishButtonLabel : nextButtonLabel}
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button 
              size="small" 
              onClick={handleBack} 
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
              {backButtonLabel}
            </Button>
          }
        />
      )}
    </>
  );
};

export default MobileStepper; 