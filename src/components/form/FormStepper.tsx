import { ReactNode, useState } from 'react';
import { 
  Box, 
  Button, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  StepButton,
  MobileStepper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export type FormStepProps = {
  label: string;
  optional?: boolean;
  content: ReactNode;
  validationHandler?: () => Promise<boolean> | boolean;
};

export type FormStepperProps = {
  steps: FormStepProps[];
  orientation?: 'horizontal' | 'vertical' | 'mobile';
  linear?: boolean;
  alternativeLabel?: boolean;
  onComplete?: (activeStep: number) => void;
  completedStepIcon?: ReactNode;
  nextButtonLabel?: string;
  backButtonLabel?: string;
  finishButtonLabel?: string;
  showStepNumbers?: boolean;
  allowSkip?: boolean;
  className?: string;
  paperProps?: React.ComponentProps<typeof Paper>;
  stepperProps?: React.ComponentProps<typeof Stepper>;
};

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
}: FormStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [skipped, setSkipped] = useState(new Set<number>());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // If on mobile screen and orientation is not explicitly set to mobile or vertical, use mobile
  const effectiveOrientation = isMobile && orientation === 'horizontal' 
    ? 'mobile' 
    : orientation;

  const isStepComplete = (step: number) => completed[step];
  const isStepSkipped = (step: number) => skipped.has(step);
  const isStepOptional = (step: number) => Boolean(steps[step]?.optional);

  const handleNext = async () => {
    const currentStep = steps[activeStep];
    
    // Check if the current step has a validation handler
    if (currentStep?.validationHandler) {
      const isValid = await currentStep.validationHandler();
      if (!isValid) return; // Don't proceed if validation fails
    }

    // Mark the current step as complete
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);

    // Handle skipped steps
    const newSkipped = new Set(skipped);
    if (isStepSkipped(activeStep)) {
      newSkipped.delete(activeStep);
      setSkipped(newSkipped);
    }

    // Move to next step or trigger onComplete for the last step
    if (activeStep === steps.length - 1) {
      onComplete && onComplete(activeStep);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    // Only allow jumping to steps if non-linear or the step is already completed
    if (!linear || completed[step - 1] || step < activeStep) {
      setActiveStep(step);
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    // Mark step as skipped
    const newSkipped = new Set(skipped);
    newSkipped.add(activeStep);
    setSkipped(newSkipped);
    
    // Move to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setSkipped(new Set<number>());
  };

  // Check if all steps are completed
  const isLastStepComplete = completed[steps.length - 1];
  const allStepsCompleted = steps.length > 0 && 
    steps.every((_, index) => completed[index] || isStepSkipped(index));

  // Render functions for different stepper types
  const renderHorizontalStepper = () => (
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
              <Typography variant="caption">Optional</Typography>
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
                  onClick={handleStep(index)}
                  optional={stepProps.optional}
                >
                  {step.label}
                </StepButton>
              )}
            </Step>
          );
        })}
      </Stepper>

      <Box sx={{ mt: 2, mb: 1 }}>
        {steps[activeStep]?.content}
      </Box>

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

  const renderVerticalStepper = () => (
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
            <Typography variant="caption">Optional</Typography>
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
              {step.content}
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

  const renderMobileStepper = () => (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        {steps[activeStep]?.label}
      </Typography>
      
      <Box sx={{ mt: 2, mb: 3 }}>
        {steps[activeStep]?.content}
      </Box>
      
      <MobileStepper
        variant="dots"
        steps={steps.length}
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: '100%', flexGrow: 1 }}
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
    </>
  );

  return (
    <Paper 
      className={className} 
      sx={{ p: 3, width: '100%', ...paperProps?.sx }}
      {...paperProps}
    >
      {allStepsCompleted || isLastStepComplete ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            All steps completed
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Box>
      ) : (
        <>
          {effectiveOrientation === 'vertical' && renderVerticalStepper()}
          {effectiveOrientation === 'horizontal' && renderHorizontalStepper()}
          {effectiveOrientation === 'mobile' && renderMobileStepper()}
        </>
      )}
    </Paper>
  );
} 