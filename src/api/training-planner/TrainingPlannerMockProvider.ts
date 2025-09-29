// Training Planner Mock Data Provider

import { MockApiProvider } from '../base/MockApiProvider';
import { ApiResponse, ApiErrorCodes } from '../types';
import { 
  TrainingPlanner, 
  PlannerFormData, 
  Employee, 
  PlannerStatus,
  PlannerStatusType 
} from '@/types/training-planner';
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
import {
  mockExistingPlanners,
  mockEnhancedPlanners,
  mockNewEmployees,
  mockDepartments,
  mockLocations,
  mockTrainingScopes,
  mockTrainingTopics,
  mockTrainers,
  mockTrainingIncharges,
  getTrainersByDepartment,
  getTopicsByScope,
  getActiveTrainingIncharges,
  getNewEmployeesByDepartment,
  getPlannersByStatus,
  getSubmittedPlanners
} from '@/data/mock-training-data';

export class TrainingPlannerMockProvider extends MockApiProvider {
  constructor() {
    super('training_planner');
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize session storage with mock data if not exists
    if (!this.getStoredData('planners').length) {
      this.setStoredData('planners', mockEnhancedPlanners);
    }
  }

  // Get all planners with filtering and pagination
  async getPlanners(request: PlannerListRequest): Promise<ApiResponse<TrainingPlanner[]>> {
    return this.execute(async () => {
      let planners = this.getStoredData<TrainingPlanner>('planners');
      
      // Apply filters
      if (request.filters) {
        planners = this.applyPlannerFilters(planners, request.filters);
      }

      // Apply sorting
      planners = this.sortItems(planners, request.sortBy, request.sortOrder);

      // Apply pagination
      const { paginatedItems } = this.generatePagination(planners, request);

      return paginatedItems;
    }, request.config);
  }

  // Get single planner by ID
  async getPlanner(id: string): Promise<ApiResponse<PlannerWithHistory>> {
    return this.execute(async () => {
      const planners = this.getStoredData<TrainingPlanner>('planners');
      const planner = planners.find(p => p.id === id);
      
      if (!planner) {
        throw new Error('Planner not found');
      }

      // Add mock history
      const plannerWithHistory: PlannerWithHistory = {
        ...planner,
        history: [
          {
            id: '1',
            action: 'Created',
            performedBy: planner.createdBy,
            performedDate: planner.createdDate,
            newStatus: PlannerStatus.DRAFT
          },
          ...(planner.submittedDate ? [{
            id: '2',
            action: 'Submitted for Approval',
            performedBy: planner.createdBy,
            performedDate: planner.submittedDate,
            previousStatus: PlannerStatus.DRAFT,
            newStatus: PlannerStatus.SUBMITTED
          }] : []),
          ...(planner.status === PlannerStatus.APPROVED && planner.approvedDate ? [{
            id: '3',
            action: 'Approved',
            performedBy: planner.trainingIncharge?.name || 'System',
            performedDate: planner.approvedDate,
            previousStatus: PlannerStatus.SUBMITTED,
            newStatus: PlannerStatus.APPROVED
          }] : []),
          ...(planner.status === PlannerStatus.REJECTED ? [{
            id: '3',
            action: 'Rejected',
            performedBy: planner.trainingIncharge?.name || 'System',
            performedDate: planner.lastModifiedDate || new Date().toISOString(),
            previousStatus: PlannerStatus.SUBMITTED,
            newStatus: PlannerStatus.REJECTED,
            comments: planner.rejectionReason
          }] : [])
        ]
      };

      return plannerWithHistory;
    });
  }

  // Create new planner
  async createPlanner(request: CreatePlannerRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.execute(async () => {
      // Validate required fields
      const validation = this.validateRequired(request.data, [
        'employee', 'plannerType', 'selectedScopes', 'topics'
      ]);
      if (validation) throw new Error(validation.message);

      const planners = this.getStoredData<TrainingPlanner>('planners');
      
      // Check for duplicate planner
      const existingPlanner = planners.find(p => 
        p.employee.id === request.data.employee.id && 
        p.status !== PlannerStatus.REJECTED
      );
      
      if (existingPlanner) {
        throw new Error('Active planner already exists for this employee');
      }

      // Create new planner
      const newPlanner: TrainingPlanner = {
        id: this.generateId(),
        plannerNumber: `PLNR_${request.data.employee.employeeCode}_NEW`,
        employee: request.data.employee,
        plannerType: request.data.plannerType,
        trainingIncharge: request.data.trainingIncharge
          ? mockTrainingIncharges.find(ti => ti.id === request.data.trainingIncharge)
          : undefined,
        proposedFirstEvaluationDate: request.data.proposedFirstEvaluationDate,
        selectedScopes: mockTrainingScopes.filter(scope => 
          request.data.selectedScopes.includes(scope.id)
        ),
        topics: request.data.topics.map(topic => ({
          ...topic,
          id: this.generateId()
        })),
        status: PlannerStatus.DRAFT,
        createdBy: 'Current User', // In real app, this would come from auth
        createdDate: new Date().toISOString()
      };

      planners.push(newPlanner);
      this.setStoredData('planners', planners);

      return newPlanner;
    }, request.config);
  }

  // Update planner
  async updatePlanner(request: UpdatePlannerRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.execute(async () => {
      const planners = this.getStoredData<TrainingPlanner>('planners');
      const plannerIndex = planners.findIndex(p => p.id === request.id);
      
      if (plannerIndex === -1) {
        throw new Error('Planner not found');
      }

      const currentPlanner = planners[plannerIndex];
      
      // Check if planner can be updated
      if (currentPlanner.status === PlannerStatus.APPROVED) {
        throw new Error('Cannot update approved planner');
      }

      // Update planner
      // Handle trainingIncharge conversion and build properly typed update data
      const updateData: Partial<TrainingPlanner> = {};
      
      if (request.data.employee) updateData.employee = request.data.employee;
      if (request.data.plannerType) updateData.plannerType = request.data.plannerType;
      if (request.data.proposedFirstEvaluationDate) updateData.proposedFirstEvaluationDate = request.data.proposedFirstEvaluationDate;
      if (request.data.selectedScopes) {
        updateData.selectedScopes = mockTrainingScopes.filter(scope => 
          request.data.selectedScopes!.includes(scope.id)
        );
      }
      if (request.data.topics) {
        updateData.topics = request.data.topics.map(topic => ({
          ...topic,
          id: this.generateId()
        }));
      }
      if (request.data.trainingIncharge) {
        updateData.trainingIncharge = mockTrainingIncharges.find(ti => ti.id === request.data.trainingIncharge);
      }

      const updatedPlanner: TrainingPlanner = {
        ...currentPlanner,
        ...updateData,
        lastModifiedBy: 'Current User',
        lastModifiedDate: new Date().toISOString()
      };

      planners[plannerIndex] = updatedPlanner;
      this.setStoredData('planners', planners);

      return updatedPlanner;
    }, request.config);
  }

  // Submit planner for approval
  async submitPlanner(id: string): Promise<ApiResponse<TrainingPlanner>> {
    return this.execute(async () => {
      const planners = this.getStoredData<TrainingPlanner>('planners');
      const plannerIndex = planners.findIndex(p => p.id === id);
      
      if (plannerIndex === -1) {
        throw new Error('Planner not found');
      }

      const planner = planners[plannerIndex];
      
      if (planner.status !== PlannerStatus.DRAFT) {
        throw new Error('Only draft planners can be submitted');
      }

      // Update status
      planner.status = PlannerStatus.SUBMITTED;
      planner.submittedDate = new Date().toISOString();
      planner.lastModifiedBy = 'Current User';
      planner.lastModifiedDate = new Date().toISOString();

      planners[plannerIndex] = planner;
      this.setStoredData('planners', planners);

      return planner;
    });
  }

  // Approve planner
  async approvePlanner(request: ApprovalRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.execute(async () => {
      const planners = this.getStoredData<TrainingPlanner>('planners');
      const plannerIndex = planners.findIndex(p => p.id === request.plannerId);
      
      if (plannerIndex === -1) {
        throw new Error('Planner not found');
      }

      const planner = planners[plannerIndex];
      
      if (planner.status !== PlannerStatus.SUBMITTED) {
        throw new Error('Only submitted planners can be approved');
      }

      // Update status
      planner.status = PlannerStatus.APPROVED;
      planner.approvedDate = new Date().toISOString();
      planner.lastModifiedBy = 'Training Incharge';
      planner.lastModifiedDate = new Date().toISOString();

      planners[plannerIndex] = planner;
      this.setStoredData('planners', planners);

      return planner;
    }, request.config);
  }

  // Reject planner
  async rejectPlanner(request: RejectionRequest): Promise<ApiResponse<TrainingPlanner>> {
    return this.execute(async () => {
      const planners = this.getStoredData<TrainingPlanner>('planners');
      const plannerIndex = planners.findIndex(p => p.id === request.plannerId);
      
      if (plannerIndex === -1) {
        throw new Error('Planner not found');
      }

      const planner = planners[plannerIndex];
      
      if (planner.status !== PlannerStatus.SUBMITTED) {
        throw new Error('Only submitted planners can be rejected');
      }

      // Update status
      planner.status = PlannerStatus.REJECTED;
      planner.rejectionReason = request.reason;
      planner.lastModifiedBy = 'Training Incharge';
      planner.lastModifiedDate = new Date().toISOString();

      planners[plannerIndex] = planner;
      this.setStoredData('planners', planners);

      return planner;
    }, request.config);
  }

  // Get employees for planner creation
  async getEmployees(request: EmployeeListRequest): Promise<ApiResponse<Employee[]>> {
    return this.execute(async () => {
      let employees = mockNewEmployees;
      
      // Apply filters
      if (request.filters) {
        employees = this.applyEmployeeFilters(employees, request.filters);
      }

      // Apply sorting
      employees = this.sortItems(employees, request.sortBy, request.sortOrder);

      // Apply pagination
      const { paginatedItems } = this.generatePagination(employees, request);

      return paginatedItems;
    }, request.config);
  }

  // Get lookup data
  async getLookups(): Promise<ApiResponse<TrainingPlannerLookups>> {
    return this.execute(async () => {
      return {
        departments: mockDepartments,
        locations: mockLocations,
        trainingScopes: mockTrainingScopes,
        trainingTopics: mockTrainingTopics,
        trainers: mockTrainers,
        trainingIncharges: mockTrainingIncharges
      };
    });
  }

  // Get statistics
  async getStatistics(): Promise<ApiResponse<PlannerStatistics>> {
    return this.execute(async () => {
      const planners = this.getStoredData<TrainingPlanner>('planners');
      
      return {
        totalDraft: planners.filter(p => p.status === PlannerStatus.DRAFT).length,
        totalSubmitted: planners.filter(p => p.status === PlannerStatus.SUBMITTED).length,
        totalApproved: planners.filter(p => p.status === PlannerStatus.APPROVED).length,
        totalRejected: planners.filter(p => p.status === PlannerStatus.REJECTED).length,
        totalInProgress: planners.filter(p => p.status === PlannerStatus.IN_PROGRESS).length,
        totalCompleted: planners.filter(p => p.status === PlannerStatus.COMPLETED).length,
        overduePlanners: this.calculateOverduePlanners(planners),
        avgApprovalTime: this.calculateAvgApprovalTime(planners)
      };
    });
  }

  // Helper methods
  private applyPlannerFilters(planners: TrainingPlanner[], filters: any): TrainingPlanner[] {
    return planners.filter(planner => {
      if (filters.status && !filters.status.includes(planner.status)) return false;
      if (filters.departmentIds?.length && !filters.departmentIds.includes(planner.employee.department.id)) return false;
      if (filters.locationIds?.length && !filters.locationIds.includes(planner.employee.location.id)) return false;
      if (filters.trainingInchargeIds?.length && planner.trainingIncharge && !filters.trainingInchargeIds.includes(planner.trainingIncharge.id)) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = `${planner.employee.firstName} ${planner.employee.lastName} ${planner.employee.employeeCode}`.toLowerCase();
        if (!searchableText.includes(searchLower)) return false;
      }
      return true;
    });
  }

  private applyEmployeeFilters(employees: Employee[], filters: any): Employee[] {
    return employees.filter(employee => {
      if (filters.department && employee.department.id !== filters.department) return false;
      if (filters.location && employee.location.id !== filters.location) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = `${employee.firstName} ${employee.lastName} ${employee.employeeCode}`.toLowerCase();
        if (!searchableText.includes(searchLower)) return false;
      }
      return true;
    });
  }

  private calculateOverduePlanners(planners: TrainingPlanner[]): number {
    // Mock logic: consider submitted planners older than 7 days as overdue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return planners.filter(p => 
      p.status === PlannerStatus.SUBMITTED && 
      p.submittedDate && 
      new Date(p.submittedDate) < sevenDaysAgo
    ).length;
  }

  private calculateAvgApprovalTime(planners: TrainingPlanner[]): number {
    const approvedPlanners = planners.filter(p => 
      p.status === PlannerStatus.APPROVED && 
      p.submittedDate && 
      p.approvedDate
    );
    
    if (approvedPlanners.length === 0) return 0;
    
    const totalDays = approvedPlanners.reduce((sum, planner) => {
      const submitted = new Date(planner.submittedDate!);
      const approved = new Date(planner.approvedDate!);
      const diffTime = approved.getTime() - submitted.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    return Math.round(totalDays / approvedPlanners.length);
  }
}