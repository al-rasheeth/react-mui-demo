import { ReactNode, useState, useEffect, useCallback } from 'react';
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
  useTheme,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';

export type FormStepAction = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  tooltip?: string;
  disabled?: boolean;
};

export type FormStepProps = {
  label: string;
  optional?: boolean;
  content: ReactNode;
  validationHandler?: () => Promise<boolean> | boolean;
  actions?: FormStepAction[];
  subLabel?: string;
  // Flag to save data when moving away from this step
  saveOnExit?: boolean;
  // Callback when this step becomes active
  onActivate?: () => void;
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
  // Initial step index
  initialStep?: number;
  // Save function that runs before step change if the step has saveOnExit=true
  onSave?: () => Promise<boolean> | boolean;
  // Allow global actions that are shown on all steps
  globalActions?: FormStepAction[];
  // Auto-save timer in ms (0 to disable)
  autoSaveInterval?: number;
  // Completion criteria
  requireAllStepsComplete?: boolean;
  // Navigation confirmation
  confirmNavigation?: boolean;
  confirmNavigationMessage?: string;
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
  initialStep = 0,
  onSave,
  globalActions = [],
  autoSaveInterval = 0,
  requireAllStepsComplete = true,
  confirmNavigation = false,
  confirmNavigationMessage = 'Are you sure you want to navigate away? Unsaved changes may be lost.',
}: FormStepperProps) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [skipped, setSkipped] = useState(new Set<number>());
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // If on mobile screen and orientation is not explicitly set to mobile or vertical, use mobile
  const effectiveOrientation = isMobile && orientation === 'horizontal' 
    ? 'mobile' 
    : orientation;

  const isStepComplete = (step: number) => completed[step];
  const isStepSkipped = (step: number) => skipped.has(step);
  const isStepOptional = (step: number) => Boolean(steps[step]?.optional);

  // Effect to run onActivate when a step becomes active
  useEffect(() => {
    const currentStep = steps[activeStep];
    if (currentStep?.onActivate) {
      currentStep.onActivate();
    }
  }, [activeStep, steps]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveInterval || !onSave) return;
    
    const timer = setInterval(() => {
      const result = onSave();
      if (result instanceof Promise) {
        result.then((success) => {
          if (success) {
            setLastAutoSave(new Date());
          }
        });
      } else if (result === true) {
        setLastAutoSave(new Date());
      }
    }, autoSaveInterval);
    
    return () => clearInterval(timer);
  }, [autoSaveInterval, onSave]);

  // Handle save (returns true if save is successful or not needed)
  const handleSave = async (): Promise<boolean> => {
    if (!onSave) return true;
    
    try {
      return await onSave();
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    }
  };

  const confirmStepChange = useCallback((): boolean => {
    if (!confirmNavigation) return true;
    return window.confirm(confirmNavigationMessage);
  }, [confirmNavigation, confirmNavigationMessage]);

  const handleNext = async () => {
    const currentStep = steps[activeStep];
    
    // Check if the current step has a validation handler
    if (currentStep?.validationHandler) {
      const isValid = await currentStep.validationHandler();
      if (!isValid) return; // Don't proceed if validation fails
    }

    // If the current step has saveOnExit, attempt to save
    if (currentStep?.saveOnExit) {
      const saveSuccess = await handleSave();
      if (!saveSuccess) {
        // Optionally show a message about save failure
        return;
      }
    }

    // Ask for confirmation if enabled
    if (!confirmStepChange()) return;

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

  const handleBack = async () => {
    const currentStep = steps[activeStep];
    
    // If the current step has saveOnExit, attempt to save
    if (currentStep?.saveOnExit) {
      const saveSuccess = await handleSave();
      if (!saveSuccess) return;
    }

    // Ask for confirmation if enabled
    if (!confirmStepChange()) return;
    
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => async () => {
    // Only allow jumping to steps if non-linear or the step is already completed
    if (!linear || completed[step - 1] || step < activeStep) {
      const currentStep = steps[activeStep];
      
      // If the current step has saveOnExit, attempt to save
      if (currentStep?.saveOnExit) {
        const saveSuccess = await handleSave();
        if (!saveSuccess) return;
      }

      // Ask for confirmation if enabled
      if (!confirmStepChange()) return;
      
      setActiveStep(step);
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    // Ask for confirmation if enabled
    if (!confirmStepChange()) return;

    // Mark step as skipped
    const newSkipped = new Set(skipped);
    newSkipped.add(activeStep);
    setSkipped(newSkipped);
    
    // Move to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    if (!confirmStepChange()) return;
    
    setActiveStep(0);
    setCompleted({});
    setSkipped(new Set<number>());
  };

  // Manual save handler
  const handleManualSave = async () => {
    const saveSuccess = await handleSave();
    if (saveSuccess) {
      setLastAutoSave(new Date());
    }
  };

  // Check if all steps are completed or skipped
  const isLastStepComplete = completed[steps.length - 1];
  const allStepsCompleted = steps.length > 0 && (
    requireAllStepsComplete 
      ? steps.every((_, index) => completed[index] || isStepSkipped(index))
      : isLastStepComplete
  );

  // Render step actions
  const renderStepActions = (stepIndex: number) => {
    const stepActions = steps[stepIndex]?.actions || [];
    if (stepActions.length === 0) return null;

    return (
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <ButtonGroup size="small" variant="outlined">
          {stepActions.map((action, idx) => (
            <Tooltip key={idx} title={action.tooltip || ''} arrow>
              <Button
                onClick={action.onClick}
                color={action.color || 'primary'}
                variant={action.variant || 'outlined'}
                disabled={action.disabled}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            </Tooltip>
          ))}
        </ButtonGroup>
      </Box>
    );
  };

  // Render global actions
  const renderGlobalActions = () => {
    if (globalActions.length === 0 && !onSave) return null;

    return (
      <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        {lastAutoSave && (
          <Typography variant="caption" sx={{ mr: 2, alignSelf: 'center', color: 'text.secondary' }}>
            Last saved: {lastAutoSave.toLocaleTimeString()}
          </Typography>
        )}
        
        <ButtonGroup size="small" variant="outlined">
          {onSave && (
            <Tooltip title="Save changes" arrow>
              <Button
                onClick={handleManualSave}
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Tooltip>
          )}
          
          {globalActions.map((action, idx) => (
            <Tooltip key={idx} title={action.tooltip || ''} arrow>
              <Button
                onClick={action.onClick}
                color={action.color || 'primary'}
                variant={action.variant || 'outlined'}
                disabled={action.disabled}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            </Tooltip>
          ))}
        </ButtonGroup>
      </Box>
    );
  };

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

      {renderGlobalActions()}

      <Box sx={{ mt: 2, mb: 1 }}>
        {steps[activeStep]?.content}
      </Box>

      {renderStepActions(activeStep)}

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
              {renderGlobalActions()}
              {step.content}
              {renderStepActions(index)}
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
      
      {steps[activeStep]?.subLabel && (
        <Typography variant="caption" align="center" display="block" gutterBottom>
          {steps[activeStep].subLabel}
        </Typography>
      )}
      
      {renderGlobalActions()}
      
      <Box sx={{ mt: 2, mb: 3 }}>
        {steps[activeStep]?.content}
      </Box>
      
      {renderStepActions(activeStep)}
      
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
          <Button 
            onClick={handleReset} 
            sx={{ mt: 1, mr: 1 }}
            startIcon={<RefreshIcon />}
          >
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