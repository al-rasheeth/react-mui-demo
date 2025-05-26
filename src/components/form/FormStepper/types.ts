import { ReactNode } from 'react';
import { Paper, Stepper } from '@mui/material';

/**
 * Defines an action button that can be shown in a form step
 */
export type FormStepAction = {
  /** Display text for the action button */
  label: string;
  /** Callback function when the action is clicked */
  onClick: () => void;
  /** Optional icon to display with the action */
  icon?: ReactNode;
  /** Button variant */
  variant?: 'text' | 'outlined' | 'contained';
  /** Button color */
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** Tooltip text for the action */
  tooltip?: string;
  /** Whether the action is disabled */
  disabled?: boolean;
};

/**
 * Defines a single step in the form stepper
 */
export type FormStepProps = {
  /** Primary label for the step */
  label: string;
  /** Whether the step is optional */
  optional?: boolean;
  /** Content to display for this step */
  content: ReactNode;
  /** Validation function that must resolve to true before proceeding to next step */
  validationHandler?: () => Promise<boolean> | boolean;
  /** Action buttons to display for this step */
  actions?: FormStepAction[];
  /** Secondary label or description for the step */
  subLabel?: string;
  /** Flag to save data when moving away from this step */
  saveOnExit?: boolean;
  /** Callback when this step becomes active */
  onActivate?: () => void;
};

/**
 * Configuration for the FormStepper component
 */
export type FormStepperProps = {
  /** Array of steps to display in the stepper */
  steps: FormStepProps[];
  /** Orientation of the stepper */
  orientation?: 'horizontal' | 'vertical' | 'mobile';
  /** Whether the stepper enforces linear progression */
  linear?: boolean;
  /** For horizontal orientation, whether to use alternative label placement */
  alternativeLabel?: boolean;
  /** Callback when all steps are completed */
  onComplete?: (activeStep: number) => void;
  /** Icon to display for completed steps */
  completedStepIcon?: ReactNode;
  /** Label for the next/continue button */
  nextButtonLabel?: string;
  /** Label for the back button */
  backButtonLabel?: string;
  /** Label for the finish button on the last step */
  finishButtonLabel?: string;
  /** Whether to show step numbers instead of icons */
  showStepNumbers?: boolean;
  /** Whether to allow skipping optional steps */
  allowSkip?: boolean;
  /** CSS class name for the component */
  className?: string;
  /** Props to pass to the Paper component */
  paperProps?: React.ComponentProps<typeof Paper>;
  /** Props to pass to the Stepper component */
  stepperProps?: React.ComponentProps<typeof Stepper>;
  /** Initial step index */
  initialStep?: number;
  /** Save function that runs before step change if the step has saveOnExit=true */
  onSave?: () => Promise<boolean> | boolean;
  /** Global action buttons that appear on all steps */
  globalActions?: FormStepAction[];
  /** Auto-save timer in ms (0 to disable) */
  autoSaveInterval?: number;
  /** Whether completion requires all steps to be completed, or just the last step */
  requireAllStepsComplete?: boolean;
  /** Whether to confirm navigation away from unsaved steps */
  confirmNavigation?: boolean;
  /** Message to display when confirming navigation */
  confirmNavigationMessage?: string;
  /** Mobile stepper variant */
  mobileStepperVariant?: 'text' | 'dots' | 'progress';
  /** Mobile stepper position */
  mobileStepperPosition?: 'static' | 'top' | 'bottom';
};

/**
 * Props for the stepper context provider
 */
export type StepperContextProps = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  completed: { [k: number]: boolean };
  setCompleted: (completed: { [k: number]: boolean }) => void;
  skipped: Set<number>;
  setSkipped: (skipped: Set<number>) => void;
  lastAutoSave: Date | null;
  setLastAutoSave: (date: Date | null) => void;
  handleNext: () => Promise<void>;
  handleBack: () => Promise<void>;
  handleSkip: () => void;
  handleReset: () => void;
  handleSave: () => Promise<boolean>;
  isStepComplete: (step: number) => boolean;
  isStepSkipped: (step: number) => boolean;
  isStepOptional: (step: number) => boolean;
  globalActions: FormStepAction[];
};

/**
 * Props for the horizontal stepper component
 */
export type HorizontalStepperProps = {
  steps: FormStepProps[];
  activeStep: number;
  alternativeLabel: boolean;
  linear: boolean;
  stepperProps?: React.ComponentProps<typeof Stepper>;
  showStepNumbers: boolean;
  completedStepIcon: ReactNode;
  nextButtonLabel: string;
  backButtonLabel: string;
  finishButtonLabel: string;
  allowSkip: boolean;
}

/**
 * Props for the vertical stepper component
 */
export type VerticalStepperProps = {
  steps: FormStepProps[];
  activeStep: number;
  linear: boolean;
  stepperProps?: React.ComponentProps<typeof Stepper>;
  showStepNumbers: boolean;
  nextButtonLabel: string;
  backButtonLabel: string;
  finishButtonLabel: string;
  allowSkip: boolean;
}

/**
 * Props for the mobile stepper component
 */
export type MobileStepperProps = {
  steps: FormStepProps[];
  activeStep: number;
  mobileStepperVariant: 'text' | 'dots' | 'progress';
  mobileStepperPosition: 'static' | 'top' | 'bottom';
  nextButtonLabel: string;
  backButtonLabel: string;
  finishButtonLabel: string;
}

/**
 * Props for the step actions component
 */
export type StepActionsProps = {
  actions: FormStepAction[];
}

/**
 * Props for the global actions component
 */
export type GlobalActionsProps = {
  actions: FormStepAction[];
  onSave?: () => Promise<boolean> | boolean;
  lastAutoSave: Date | null;
} 