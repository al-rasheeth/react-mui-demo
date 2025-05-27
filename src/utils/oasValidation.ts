import axios from 'axios';
import yaml from 'js-yaml';
import OpenAPISchemaValidator from 'openapi-schema-validator';

// Interface for validation results
export interface OasValidationResult {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
  stats: {
    endpoints: number;
    schemas: number;
    version: string;
  };
  document?: any; // The parsed OpenAPI document
}

// Function to read file as text
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Parse spec content based on format (JSON or YAML)
export const parseSpecContent = (content: string): any => {
  try {
    // Try parsing as JSON first
    return JSON.parse(content);
  } catch (jsonError) {
    try {
      // If JSON parsing fails, try YAML
      return yaml.load(content);
    } catch (yamlError) {
      throw new Error('Invalid specification format. Must be valid JSON or YAML.');
    }
  }
};

// Function to fetch spec from URL
export const fetchSpecFromUrl = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
    if (typeof response.data === 'object') {
      return response.data; // If response is already an object, it's likely JSON
    } else if (typeof response.data === 'string') {
      return parseSpecContent(response.data); // Parse the string response
    }
    throw new Error('Invalid response format');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch specification: ${error.message}`);
    }
    throw error;
  }
};

// Count endpoints in an OpenAPI spec
const countEndpoints = (spec: any): number => {
  if (!spec.paths) return 0;

  let count = 0;
  Object.keys(spec.paths).forEach(path => {
    const pathItem = spec.paths[path];
    // Count HTTP methods (operations) in each path
    const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
    methods.forEach(method => {
      if (pathItem[method]) count++;
    });
  });
  return count;
};

// Count schema definitions in an OpenAPI spec
const countSchemas = (spec: any): number => {
  // OpenAPI 3.0+
  if (spec.components && spec.components.schemas) {
    return Object.keys(spec.components.schemas).length;
  }
  // OpenAPI/Swagger 2.0
  if (spec.definitions) {
    return Object.keys(spec.definitions).length;
  }
  return 0;
};

// Get OpenAPI version
const getSpecVersion = (spec: any): string => {
  if (spec.openapi) return spec.openapi;
  if (spec.swagger) return spec.swagger;
  return 'unknown';
};

// Check if the spec is a valid OpenAPI 3.x document
const validateOpenApiVersion = (spec: any): { valid: boolean; message?: string } => {
  if (!spec.openapi) {
    if (spec.swagger) {
      return { 
        valid: false, 
        message: `Found Swagger ${spec.swagger}, but OpenAPI 3.x is required` 
      };
    }
    return { valid: false, message: 'No OpenAPI version found' };
  }
  
  const versionMatch = spec.openapi.match(/^3\.(\d+)\.(\d+)$/);
  if (!versionMatch) {
    return { valid: false, message: `Invalid OpenAPI version: ${spec.openapi}` };
  }
  
  return { valid: true };
};

// Basic structural validation for OpenAPI documents
const validateStructure = (spec: any): Array<{ path: string; message: string }> => {
  const errors: Array<{ path: string; message: string }> = [];
  
  // Check for required root fields
  if (!spec.info) {
    errors.push({ path: '/info', message: 'Required info object is missing' });
  } else {
    if (!spec.info.title) {
      errors.push({ path: '/info/title', message: 'API title is required' });
    }
    if (!spec.info.version) {
      errors.push({ path: '/info/version', message: 'API version is required' });
    }
  }
  
  // Check paths
  if (!spec.paths) {
    errors.push({ path: '/paths', message: 'Required paths object is missing' });
  } else if (typeof spec.paths !== 'object') {
    errors.push({ path: '/paths', message: 'Paths must be an object' });
  } else {
    // Check each path for operations
    Object.keys(spec.paths).forEach(path => {
      const pathItem = spec.paths[path];
      if (typeof pathItem !== 'object') {
        errors.push({ path: `/paths/${path}`, message: 'Path item must be an object' });
        return;
      }
      
      // Check operations
      const operations = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
      operations.forEach(method => {
        if (pathItem[method]) {
          const operation = pathItem[method];
          
          // Check for operationId
          if (!operation.operationId) {
            errors.push({ 
              path: `/paths/${path}/${method}`, 
              message: 'Operation ID is missing' 
            });
          }
          
          // Check responses
          if (!operation.responses) {
            errors.push({ 
              path: `/paths/${path}/${method}/responses`, 
              message: 'Responses object is missing' 
            });
          }
        }
      });
    });
  }
  
  return errors;
};

// Main validation function
export const validateOasDocument = async (source: File | string): Promise<OasValidationResult> => {
  try {
    let spec: any;
    
    if (typeof source === 'string') {
      // Source is a URL
      spec = await fetchSpecFromUrl(source);
    } else {
      // Source is a File
      const content = await readFileAsText(source);
      spec = parseSpecContent(content);
    }
    
    // Determine the OpenAPI version
    const version = spec.openapi || (spec.swagger === '2.0' ? '2.0' : null);
    
    if (!version) {
      return {
        valid: false,
        errors: [{ path: '', message: 'Invalid OpenAPI document: no version detected' }],
        stats: {
          endpoints: 0,
          schemas: 0,
          version: 'unknown',
        },
        document: spec
      };
    }
    
    // Choose appropriate validator version based on OpenAPI version
    const validatorVersion = version.startsWith('3.1') ? 3 : 
                            version.startsWith('3.0') ? 3 : 
                            version.startsWith('2.0') ? 2 : null;
    
    if (!validatorVersion) {
      return {
        valid: false,
        errors: [{ path: '', message: `Unsupported OpenAPI version: ${version}` }],
        stats: {
          endpoints: 0,
          schemas: 0,
          version
        },
        document: spec
      };
    }
    
    // Create the validator using the openapi-schema-validator library
    const validator = new OpenAPISchemaValidator({ version: validatorVersion });
    
    // Validate the document
    const result = validator.validate(spec);
    
    // Build validation results
    const validationErrors = result.errors.map(error => {
      // Use type assertion for the error object
      const anyError = error as any;
      
      // Extract path and message safely
      const path = anyError.dataPath || anyError.instancePath || anyError.schemaPath || '';
      const message = anyError.message || 'Unknown validation error';
      
      return { path, message };
    });
    
    // Add any structural validation we still want to perform
    const structureErrors = validateStructure(spec);
    
    // Combine the errors
    const allErrors = [...validationErrors, ...structureErrors];
    
    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      stats: {
        endpoints: countEndpoints(spec),
        schemas: countSchemas(spec),
        version: getSpecVersion(spec),
      },
      document: spec
    };
  } catch (error: unknown) {
    return {
      valid: false,
      errors: [{ 
        path: '/', 
        message: error instanceof Error ? error.message : 'Unknown error during validation' 
      }],
      stats: {
        endpoints: 0,
        schemas: 0,
        version: 'unknown',
      },
    };
  }
}; 