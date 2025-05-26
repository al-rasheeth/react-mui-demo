import React, { useMemo } from 'react';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FormStepperProps, FormStepProps, HorizontalStepperProps, VerticalStepperProps, MobileStepperProps } from './types';
import { StepperProvider, useStepperContext } from './StepperContext';
import HorizontalStepper from './HorizontalStepper';
import VerticalStepper from './VerticalStepper';
import MobileStepper from './MobileStepper';
import CompletedView from './CompletedView';

/**
 * Internal component that renders the appropriate stepper based on orientation
 */
const StepperContent: React.FC<{
  orientation: 'horizontal' | 'vertical' | 'mobile';
  horizontalProps: Omit<HorizontalStepperProps, 'activeStep'>;
  verticalProps: Omit<VerticalStepperProps, 'activeStep'>;
  mobileProps: Omit<MobileStepperProps, 'activeStep'>;
  requireAllStepsComplete: boolean;
}> = ({
  orientation,
  horizontalProps,
  verticalProps,
  mobileProps,
  requireAllStepsComplete
}) => {
  const { 
    activeStep, 
    completed, 
    skipped 
  } = useStepperContext();
  
  const steps = horizontalProps.steps;

  // Check completion status
  const isLastStepComplete = completed[steps.length - 1];
  
  const isFormComplete = steps.length > 0 && (
    requireAllStepsComplete 
      ? steps.every((_: FormStepProps, index: number) => completed[index] || skipped.has(index))
      : isLastStepComplete
  );

  if (isFormComplete) {
    return <CompletedView />;
  }

  switch (orientation) {
    case 'vertical':
      return <VerticalStepper {...verticalProps} activeStep={activeStep} />;
    case 'mobile':
      return <MobileStepper {...mobileProps} activeStep={activeStep} />;
    case 'horizontal':
    default:
      return <HorizontalStepper {...horizontalProps} activeStep={activeStep} />;
  }
};

/**
 * A comprehensive form stepper component supporting multiple layouts and features
 */
export function FormStepper({
  steps,
  orientation = 'horizontal',
  linear = true,
  alternativeLabel = false,
  onComplete,
  completedStepIcon = <CheckCircleIcon color="success" />,
  nextButtonLabel = 'Continue',
  backButtonLabel = 'Back',
  finishButtonLabel = 'Finish',
  showStepNumbers = false,
  allowSkip = false,
  className,
  paperProps,
  stepperProps,
  initialStep = 0,
  onSave,
  globalActions = [],
  autoSaveInterval = 0,
  requireAllStepsComplete = true,
  confirmNavigation = false,
  confirmNavigationMessage = 'Are you sure you want to navigate away? Unsaved changes may be lost.',
  mobileStepperVariant = 'dots',
  mobileStepperPosition = 'static',
}: FormStepperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // If on mobile screen and orientation is not explicitly set to mobile or vertical, use mobile
  const effectiveOrientation = isMobile && orientation === 'horizontal' 
    ? 'mobile' 
    : orientation;

  // Memoize the stepper components to prevent unnecessary re-renders
  const horizontalStepperProps = useMemo((): Omit<HorizontalStepperProps, 'activeStep'> => ({
    steps,
    alternativeLabel,
    linear,
    stepperProps,
    showStepNumbers,
    completedStepIcon,
    nextButtonLabel,
    backButtonLabel,
    finishButtonLabel,
    allowSkip,
  }), [
    steps, 
    alternativeLabel, 
    linear, 
    stepperProps, 
    showStepNumbers, 
    completedStepIcon, 
    nextButtonLabel, 
    backButtonLabel, 
    finishButtonLabel, 
    allowSkip
  ]);

  const verticalStepperProps = useMemo((): Omit<VerticalStepperProps, 'activeStep'> => ({
    steps,
    linear,
    stepperProps,
    showStepNumbers,
    nextButtonLabel,
    backButtonLabel,
    finishButtonLabel,
    allowSkip,
  }), [
    steps, 
    linear, 
    stepperProps, 
    showStepNumbers, 
    nextButtonLabel, 
    backButtonLabel, 
    finishButtonLabel, 
    allowSkip
  ]);

  const mobileStepperProps = useMemo((): Omit<MobileStepperProps, 'activeStep'> => ({
    steps,
    mobileStepperVariant,
    mobileStepperPosition,
    nextButtonLabel,
    backButtonLabel,
    finishButtonLabel,
  }), [
    steps, 
    mobileStepperVariant, 
    mobileStepperPosition, 
    nextButtonLabel, 
    backButtonLabel, 
    finishButtonLabel
  ]);

  return (
    <Paper 
      className={className} 
      sx={{ p: 3, width: '100%', ...paperProps?.sx }}
      {...paperProps}
    >
      <StepperProvider
        steps={steps}
        initialStep={initialStep}
        onComplete={onComplete}
        onSave={onSave}
        autoSaveInterval={autoSaveInterval}
        confirmNavigation={confirmNavigation}
        confirmNavigationMessage={confirmNavigationMessage}
        globalActions={globalActions}
      >
        <StepperContent 
          orientation={effectiveOrientation}
          horizontalProps={horizontalStepperProps}
          verticalProps={verticalStepperProps}
          mobileProps={mobileStepperProps}
          requireAllStepsComplete={requireAllStepsComplete}
        />
      </StepperProvider>
    </Paper>
  );
} 