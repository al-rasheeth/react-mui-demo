import { useContext } from 'react';
import { StepperContextProps } from './types';
import { StepperContext } from './StepperContext';

/**
 * Custom hook to use the stepper context
 * @returns The stepper context
 * @throws Error if used outside of a StepperProvider
 */
export const useStepperContext = (): StepperContextProps => {
  const context = useContext(StepperContext);
  if (context === undefined) {
    throw new Error('useStepperContext must be used within a StepperProvider');
  }
  return context;
}; 