// Core API Types and Interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string; // For validation errors
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
  timestamp: string;
  requestId: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiRequestConfig {
  delay?: number; // Artificial delay for mock
  simulateError?: boolean;
  errorCode?: string;
}

// Business Error Codes
export const ApiErrorCodes = {
  // Generic
  UNKNOWN: 'UNKNOWN',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business Logic
  DUPLICATE_RECORD: 'DUPLICATE_RECORD',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  UNAUTHORIZED_ACTION: 'UNAUTHORIZED_ACTION',
  
  // Training Planner Specific
  TRAINER_NOT_AVAILABLE: 'TRAINER_NOT_AVAILABLE',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  TOPIC_ALREADY_ASSIGNED: 'TOPIC_ALREADY_ASSIGNED',
  PLANNER_ALREADY_SUBMITTED: 'PLANNER_ALREADY_SUBMITTED',
} as const;

export type ApiErrorCode = typeof ApiErrorCodes[keyof typeof ApiErrorCodes];

// Request/Response types for different operations
export interface CreateRequest<T> {
  data: T;
  config?: ApiRequestConfig;
}

export interface UpdateRequest<T> {
  id: string;
  data: Partial<T>;
  config?: ApiRequestConfig;
}

export interface DeleteRequest {
  id: string;
  config?: ApiRequestConfig;
}

export interface GetRequest {
  id: string;
  config?: ApiRequestConfig;
}

export interface ListRequest<TFilter = any> extends PaginatedRequest {
  filters?: TFilter;
  config?: ApiRequestConfig;
}