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
  plannerStatus?: PlannerStatusType;
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
  isCancelled?: boolean; // For cancelled topics
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

// Extended types for Edit Employee Planner
export const TopicStatus = {
  PENDING_TI_APPROVAL: "Pending TI Approval",
  TI_APPROVED: "TI Approved", 
  TI_REJECTED: "TI Rejected",
  PENDING_TRAINER_APPROVAL: "Pending Trainer Approval",
  TRAINER_ACCEPTED: "Trainer Accepted",
  TRAINER_REJECTED: "Trainer Rejected",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
} as const;

export type TopicStatusType = typeof TopicStatus[keyof typeof TopicStatus];

export const AmendmentStatus = {
  NONE: "None",
  IN_PROGRESS: "In Progress", 
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected"
} as const;

export type AmendmentStatusType = typeof AmendmentStatus[keyof typeof AmendmentStatus];

export interface ReferenceDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedDate: string;
  uploadedBy: string;
}

export interface CancellationReason {
  id: string;
  reason: string;
  cancelledBy: string;
  cancelledDate: string;
  comments?: string;
}

export interface AmendmentVersion {
  versionNumber: number;
  createdDate: string;
  createdBy: string;
  status: AmendmentStatusType;
  approvedDate?: string;
  approvedBy?: string;
  rejectedDate?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface EnhancedTrainingPlannerTopic extends TrainingPlannerTopic {
  status: TopicStatusType;
  isEditable: boolean;
  canRemove: boolean;
  canCancel: boolean;
  referenceDocument?: ReferenceDocument;
  cancellationReason?: CancellationReason;
  trainerAcceptedDate?: string;
  trainerRejectedDate?: string;
  attendanceMarked?: boolean;
  ratingGiven?: boolean;
  amendmentVersion?: number;
}

export interface EditablePlannerState {
  canEdit: boolean;
  canAmend: boolean;
  canSubmit: boolean;
  canSave: boolean;
  canSaveAsDraft: boolean;
  canCancel: boolean;
  isAmendmentMode: boolean;
  hasUnsavedChanges: boolean;
}

export interface EnhancedTrainingPlanner extends TrainingPlanner {
  topics: EnhancedTrainingPlannerTopic[];
  amendmentVersion: number;
  amendmentHistory: AmendmentVersion[];
  currentAmendmentStatus: AmendmentStatusType;
  editableState: EditablePlannerState;
  isMovedToFinalEvaluation: boolean;
  needsRetraining: boolean;
}