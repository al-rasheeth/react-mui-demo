import axios from 'axios';
import { OasValidationResult, validateOasDocument } from '@utils/oasValidation';

// Define interfaces for request and response
export interface PublishApiRequest {
  category: string;
  service: string;
  version: string;
  description?: string;
  specSource: File | string;
}

export interface PublishApiResponse {
  success: boolean;
  apiId?: string;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Mock API endpoint configuration - replace with actual endpoint in production
const API_CONFIG = {
  baseUrl: '/api',  // Base URL for API calls
  endpoints: {
    publish: '/apis',
    validate: '/apis/validate',
  },
  timeout: 30000, // 30 seconds
};

export class ApiPublishService {
  /**
   * Validate an OpenAPI specification document
   */
  static async validateSpec(source: File | string): Promise<OasValidationResult> {
    try {
      // Use the validation logic from oasValidation utility
      return await validateOasDocument(source);
    } catch (error) {
      console.error('Error during validation:', error);
      return {
        valid: false,
        errors: [{ 
          path: '/', 
          message: error instanceof Error ? error.message : 'Unknown validation error' 
        }],
        stats: {
          endpoints: 0,
          schemas: 0,
          version: 'unknown',
        },
      };
    }
  }

  /**
   * Publish an API specification to the backend
   * In a real implementation, this would send the data to an actual API endpoint
   */
  static async publishApi(request: PublishApiRequest): Promise<PublishApiResponse> {
    try {
      // For demonstration purposes - in a real app, send to an actual API
      // const response = await axios.post(API_CONFIG.baseUrl + API_CONFIG.endpoints.publish, formData);
      // return response.data;
      
      // Mock successful response
      return {
        success: true,
        apiId: `api-${Math.floor(Math.random() * 10000)}`,
        message: 'API specification published successfully',
      };
    } catch (error) {
      console.error('Error publishing API:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        // Handle structured error response from server
        return {
          success: false,
          message: 'Failed to publish API',
          errors: error.response.data.errors || [{ field: 'general', message: error.response.data.message }],
        };
      }
      
      // Generic error handling
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
} 