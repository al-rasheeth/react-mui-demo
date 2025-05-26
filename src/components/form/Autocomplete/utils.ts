import { AutocompleteOption } from './types';

/**
 * Checks if two options are equal by comparing their values
 * 
 * @param option - The first option to compare
 * @param value - The second option to compare
 * @returns Whether the options are equal
 */
export const isOptionEqual = (option: AutocompleteOption | string | null, value: AutocompleteOption | string | null): boolean => {
  if (!option || !value) return option === value;
  return (option as AutocompleteOption).value === (value as AutocompleteOption).value;
};

/**
 * Gets the label for an option
 * 
 * @param option - The option to get the label for
 * @returns The label for the option
 */
export const getOptionLabel = (option: AutocompleteOption | string | null): string => {
  if (!option) return '';
  if (typeof option === 'string') return option;
  return (option as AutocompleteOption).label || '';
}; 