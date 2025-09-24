// Base Mock API Provider

import { ApiResponse, ApiError, ApiErrorCodes, ApiRequestConfig, ResponseMeta, PaginatedRequest, PaginationMeta } from '../types';

export abstract class MockApiProvider {
  protected defaultDelay = 800; // Realistic network delay
  protected sessionKey: string;

  constructor(sessionKey: string) {
    this.sessionKey = sessionKey;
  }

  // Simulate network delay
  protected delay(ms?: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms || this.defaultDelay));
  }

  // Generate request metadata
  protected generateMeta(pagination?: PaginationMeta): ResponseMeta {
    return {
      pagination,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  // Create success response
  protected success<T>(data: T, meta?: ResponseMeta): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: meta || this.generateMeta()
    };
  }

  // Create error response
  protected error(code: string, message: string, details?: Record<string, any>, field?: string): ApiResponse {
    const error: ApiError = {
      code,
      message,
      details,
      field
    };

    return {
      success: false,
      error,
      meta: this.generateMeta()
    };
  }

  // Simulate potential errors
  protected shouldSimulateError(config?: ApiRequestConfig): boolean {
    if (config?.simulateError) return true;
    // 5% chance of random network error in development
    return Math.random() < 0.05;
  }

  // Generate pagination metadata
  protected generatePagination<T>(
    items: T[], 
    request: PaginatedRequest
  ): { paginatedItems: T[], pagination: PaginationMeta } {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedItems = items.slice(startIndex, endIndex);
    
    const pagination: PaginationMeta = {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };

    return { paginatedItems, pagination };
  }

  // Sort items
  protected sortItems<T>(items: T[], sortBy?: string, sortOrder?: 'asc' | 'desc'): T[] {
    if (!sortBy) return items;

    return [...items].sort((a, b) => {
      const aValue = this.getNestedValue(a, sortBy);
      const bValue = this.getNestedValue(b, sortBy);
      
      let comparison = 0;
      
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  // Get nested object value by path (e.g., 'employee.name')
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Session storage helpers
  protected getStoredData<T>(key: string): T[] {
    try {
      const stored = sessionStorage.getItem(`${this.sessionKey}_${key}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  protected setStoredData<T>(key: string, data: T[]): void {
    try {
      sessionStorage.setItem(`${this.sessionKey}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to store data in session storage:', error);
    }
  }

  // Generate unique ID
  protected generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate required fields
  protected validateRequired<T extends Record<string, any>>(
    data: T, 
    requiredFields: (keyof T)[]
  ): ApiError | null {
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        return {
          code: ApiErrorCodes.REQUIRED_FIELD,
          message: `Field '${String(field)}' is required`,
          field: String(field)
        };
      }
    }
    return null;
  }

  // Execute with error simulation and delay
  protected async execute<T>(
    operation: () => T | Promise<T>,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // Simulate delay
      await this.delay(config?.delay);

      // Simulate errors
      if (this.shouldSimulateError(config)) {
        const errorCode = config?.errorCode || ApiErrorCodes.NETWORK_ERROR;
        return this.error(errorCode, 'Simulated network error');
      }

      const result = await operation();
      return this.success(result);
    } catch (error) {
      console.error('Mock API Error:', error);
      return this.error(
        ApiErrorCodes.UNKNOWN,
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
}