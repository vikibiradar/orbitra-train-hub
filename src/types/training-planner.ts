// Training Planner Type Definitions

export interface Employee {
  id: string;
  employeeCode: string;
  employeeADID: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  location: Location;
  joiningDate: string;
  isResigned: boolean;
  applicableYear: number;
  profilePicture?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  isPSRelated: boolean;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface Trainer {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: Department;
  specializations: string[];
  isActive: boolean;
}

export interface TrainingIncharge {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: Department;
  isActive: boolean;
}

export interface TrainingTopic {
  id: string;
  name: string;
  code: string;
  description: string;
  module: TrainingModule;
  defaultDuration: number; // in hours
  scopes: TrainingScope[];
  isActive: boolean;
}

export interface TrainingModule {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface TrainingScope {
  id: string;
  name: string;
  code: string;
  description: string;
  departments: Department[];
}

export const ModeOfEvaluation = {
  QUESTION_PAPER: "Question Paper",
  PERSONNEL_INTERVIEW: "Personnel interview",
  REPLICATE_TESTING: "Replicate testing",
  RETESTING: "Retesting",
  SPIKE_RECOVERY: "Spike & recovery",
  GROUP_DISCUSSION: "Group discussion",
  EXTERNAL_EVALUATION: "External Evaluation"
} as const;

export type ModeOfEvaluationType = typeof ModeOfEvaluation[keyof typeof ModeOfEvaluation];

export const PlannerType = {
  GENERAL_NEW_EMPLOYEE: 11,
  ANNUAL_EMPLOYEE: 20
} as const;

export type PlannerTypeType = typeof PlannerType[keyof typeof PlannerType];

export const PlannerStatus = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed"
} as const;

export type PlannerStatusType = typeof PlannerStatus[keyof typeof PlannerStatus];

export interface TrainingPlannerTopic {
  id: string;
  topic: TrainingTopic;
  trainer?: Trainer;
  startDate: string;
  endDate: string;
  modeOfEvaluation?: ModeOfEvaluationType;
  comments?: string;
  isNew?: boolean; // For tracking newly added topics
  isRemoved?: boolean; // For soft delete functionality
}

export interface TrainingPlanner {
  id: string;
  plannerNumber?: string; // Format: PLNR_<EmployeeCode>_NEW
  employee: Employee;
  plannerType: PlannerTypeType;
  trainingIncharge?: TrainingIncharge;
  proposedFirstEvaluationDate?: string;
  selectedScopes: TrainingScope[];
  topics: TrainingPlannerTopic[];
  status: PlannerStatusType;
  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  submittedDate?: string;
  approvedDate?: string;
  rejectionReason?: string;
  isCopiedPlanner?: boolean;
  originalPlannerId?: string;
}

export interface PlannerFormData {
  employee: Employee;
  plannerType: PlannerTypeType;
  trainingIncharge?: string;
  proposedFirstEvaluationDate?: string;
  selectedScopes: string[];
  topics: Omit<TrainingPlannerTopic, 'id'>[];
}

export interface EmployeeFilter {
  department?: string;
  location?: string;
  searchTerm?: string;
  joiningDateFrom?: string;
  joiningDateTo?: string;
}

export interface TrainingHistory {
  id: string;
  plannerId: string;
  action: string;
  performedBy: string;
  performedDate: string;
  comments?: string;
  previousStatus?: PlannerStatusType;
  newStatus?: PlannerStatusType;
}