// Generic API Response Types

/**
 * Generic API Response structure
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API Error Response
 */
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  code?: number;
}

/**
 * Standard API operation response
 */
export interface OperationResponse {
  success: boolean;
  message: string;
  data?: any;
}