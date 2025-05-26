/**
 * Validates a file against provided constraints
 * 
 * @param file - The file to validate
 * @param accept - Optional string of accepted file types
 * @param maxSize - Optional maximum file size in bytes
 * @returns Whether the file is valid
 */
export const validateFile = (file: File, accept?: string, maxSize?: number): boolean => {
  // Validate file type if accept is provided
  if (accept) {
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop();
    
    if (!acceptedTypes.some(type => 
      type === fileType || type === fileExtension || type === '*/*'
    )) {
      return false;
    }
  }
  
  // Validate file size if maxSize is provided
  if (maxSize && file.size > maxSize) {
    return false;
  }
  
  return true;
};

/**
 * Formats a file size in a human-readable format
 * 
 * @param bytes - The file size in bytes
 * @param decimals - Number of decimal places to display
 * @returns A string representation of the file size
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}; 