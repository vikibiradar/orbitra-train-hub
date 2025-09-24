// Training Planner API Service - Facade

import { TrainingPlannerMockProvider } from './TrainingPlannerMockProvider';
import { ApiResponse } from '../types';
import { TrainingPlanner, Employee } from '@/types/training-planner';
import {
  CreatePlannerRequest,
  UpdatePlannerRequest,
  PlannerListRequest,
  EmployeeListRequest,
  ApprovalRequest,
  RejectionRequest,
  PlannerWithHistory,
  PlannerStatistics,
  TrainingPlannerLookups
} from './types';

export class TrainingPlannerApiService {
  private provider: TrainingPlannerMockProvider;

  constructor() {
    this.provider = new TrainingPlannerMockProvider();
  }

  // Planner CRUD operations
  async getPlanners(request: PlannerListRequest = {}): Promise<ApiResponse<TrainingPlanner[]>> {
    return this.provider.getPlanners(request);
  }

  async getPlanner(id: string): Promise<ApiResponse<PlannerWithHistory>> {
    return this.provider.getPlanner(id);
  }

  async createPlanner(request: CreatePlannerRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.provider.createPlanner(request);
  }

  async updatePlanner(request: UpdatePlannerRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.provider.updatePlanner(request);
  }

  async deletePlanner(id: string): Promise<ApiResponse<void>> {
    // For training planners, we typically don't hard delete, but change status
    // This would need a separate method in the provider for status changes
    // For now, return a simple success response
    return Promise.resolve({
      success: true,
      data: undefined,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}`
      }
    });
  }

  // Workflow operations
  async submitPlanner(id: string): Promise<ApiResponse<TrainingPlanner>> {
    return this.provider.submitPlanner(id);
  }

  async approvePlanner(request: ApprovalRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.provider.approvePlanner(request);
  }

  async rejectPlanner(request: RejectionRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.provider.rejectPlanner(request);
  }

  // Employee operations
  async getEmployees(request: EmployeeListRequest = {}): Promise<ApiResponse<Employee[]>> {
    return this.provider.getEmployees(request);
  }

  // Lookup data
  async getLookups(): Promise<ApiResponse<TrainingPlannerLookups>> {
    return this.provider.getLookups();
  }

  // Statistics and dashboard data
  async getStatistics(): Promise<ApiResponse<PlannerStatistics>> {
    return this.provider.getStatistics();
  }

  // Convenience methods for common queries
  async getSubmittedPlanners(): Promise<ApiResponse<TrainingPlanner[]>> {
    return this.getPlanners({
      filters: { status: ['Submitted'] }
    });
  }

  async getDraftPlanners(): Promise<ApiResponse<TrainingPlanner[]>> {
    return this.getPlanners({
      filters: { status: ['Draft'] }
    });
  }

  async getPlannersByEmployee(employeeId: string): Promise<ApiResponse<TrainingPlanner[]>> {
    // Note: This would need to be implemented in the provider
    // For now, we'll filter client-side (not ideal for real API but OK for mock)
    const response = await this.getPlanners();
    if (response.success && response.data) {
      const filteredData = response.data.filter((p: TrainingPlanner) => 
        p.employee.id === employeeId
      );
      return {
        ...response,
        data: filteredData
      };
    }
    return response;
  }
}

// Export singleton instance
export const trainingPlannerApi = new TrainingPlannerApiService();