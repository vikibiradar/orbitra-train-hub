// Training Planner API Types

import { 
  TrainingPlanner, 
  PlannerFormData, 
  Employee, 
  EmployeeFilter,
  TrainingTopic,
  TrainingScope,
  Trainer,
  TrainingIncharge,
  Department,
  Location,
  PlannerStatusType
} from '@/types/training-planner';
import { ListRequest } from '../types';

// Request/Response types for Training Planner API

export interface CreatePlannerRequest {
  data: PlannerFormData;
  config?: import('../types').ApiRequestConfig;
}

export interface UpdatePlannerRequest {
  id: string;
  data: Partial<PlannerFormData>;
  config?: import('../types').ApiRequestConfig;
}

export interface PlannerListFilter {
  status?: PlannerStatusType[];
  departmentIds?: string[];
  locationIds?: string[];
  trainingInchargeIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface PlannerListRequest extends ListRequest<PlannerListFilter> {}

export interface EmployeeListRequest extends ListRequest<EmployeeFilter> {}

export interface ApprovalRequest {
  plannerId: string;
  comments?: string;
  config?: import('../types').ApiRequestConfig;
}

export interface RejectionRequest {
  plannerId: string;
  reason: string;
  comments?: string;
  config?: import('../types').ApiRequestConfig;
}

// Response types
export interface PlannerWithHistory extends TrainingPlanner {
  history?: PlannerHistoryEntry[];
}

export interface PlannerHistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  performedDate: string;
  comments?: string;
  previousStatus?: PlannerStatusType;
  newStatus?: PlannerStatusType;
}

// Lookup data types
export interface TrainingPlannerLookups {
  departments: Department[];
  locations: Location[];
  trainingScopes: TrainingScope[];
  trainingTopics: TrainingTopic[];
  trainers: Trainer[];
  trainingIncharges: TrainingIncharge[];
}

// Dashboard/Statistics types
export interface PlannerStatistics {
  totalDraft: number;
  totalSubmitted: number;
  totalApproved: number;
  totalRejected: number;
  totalInProgress: number;
  totalCompleted: number;
  overduePlanners: number;
  avgApprovalTime: number; // in days
}