import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { FormStepProps, StepperContextProps, FormStepAction } from './types';

/**
 * Create the stepper context with default values
 */
const StepperContext = createContext<StepperContextProps | undefined>(undefined);

/**
 * Props for the StepperProvider component
 */
interface StepperProviderProps {
  children: ReactNode;
  steps: FormStepProps[];
  initialStep: number;
  onComplete?: (activeStep: number) => void;
  onSave?: () => Promise<boolean> | boolean;
  autoSaveInterval: number;
  confirmNavigation: boolean;
  confirmNavigationMessage: string;
  globalActions?: FormStepAction[];
}

/**
 * Provider component for the stepper context
 * Manages state and logic for the stepper
 */
export const StepperProvider: React.FC<StepperProviderProps> = ({
  children,
  steps,
  initialStep,
  onComplete,
  onSave,
  autoSaveInterval,
  confirmNavigation,
  confirmNavigationMessage,
  globalActions = [],
}) => {
  const [activeStep, setActiveStep] = useState<number>(initialStep);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [skipped, setSkipped] = useState<Set<number>>(new Set<number>());
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Check step statuses
  const isStepComplete = useCallback(
    (step: number) => Boolean(completed[step]),
    [completed]
  );
  
  const isStepSkipped = useCallback(
    (step: number) => skipped.has(step),
    [skipped]
  );
  
  const isStepOptional = useCallback(
    (step: number) => Boolean(steps[step]?.optional),
    [steps]
  );

  // Handle save (returns true if save is successful or not needed)
  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!onSave) return true;
    
    try {
      const result = onSave();
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    }
  }, [onSave]);

  // Navigation confirmation
  const confirmStepChange = useCallback((): boolean => {
    if (!confirmNavigation) return true;
    return window.confirm(confirmNavigationMessage);
  }, [confirmNavigation, confirmNavigationMessage]);

  // Next step handler
  const handleNext = useCallback(async () => {
    const currentStep = steps[activeStep];
    
    // Check if the current step has a validation handler
    if (currentStep?.validationHandler) {
      const result = currentStep.validationHandler();
      const isValid = result instanceof Promise ? await result : result;
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
      if (onComplete) {
        onComplete(activeStep);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [
    activeStep, 
    steps, 
    completed, 
    skipped, 
    isStepSkipped, 
    confirmStepChange, 
    handleSave, 
    onComplete
  ]);

  // Back step handler
  const handleBack = useCallback(async () => {
    const currentStep = steps[activeStep];
    
    // If the current step has saveOnExit, attempt to save
    if (currentStep?.saveOnExit) {
      const saveSuccess = await handleSave();
      if (!saveSuccess) return;
    }

    // Ask for confirmation if enabled
    if (!confirmStepChange()) return;
    
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, [activeStep, steps, confirmStepChange, handleSave]);

  // Skip step handler
  const handleSkip = useCallback(() => {
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
  }, [activeStep, isStepOptional, confirmStepChange, skipped]);

  // Reset handler
  const handleReset = useCallback(() => {
    if (!confirmStepChange()) return;
    
    setActiveStep(0);
    setCompleted({});
    setSkipped(new Set<number>());
  }, [confirmStepChange]);

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

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      activeStep,
      setActiveStep,
      completed,
      setCompleted,
      skipped,
      setSkipped,
      lastAutoSave,
      setLastAutoSave,
      handleNext,
      handleBack,
      handleSkip,
      handleReset,
      handleSave,
      isStepComplete,
      isStepSkipped,
      isStepOptional,
      globalActions,
    }),
    [
      activeStep,
      completed,
      skipped,
      lastAutoSave,
      handleNext,
      handleBack,
      handleSkip,
      handleReset,
      handleSave,
      isStepComplete,
      isStepSkipped,
      isStepOptional,
      globalActions,
    ]
  );

  return (
    <StepperContext.Provider value={contextValue}>
      {children}
    </StepperContext.Provider>
  );
};

// Export the context to be used in the hook file
export { StepperContext }; 