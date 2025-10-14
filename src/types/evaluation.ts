// Evaluation System Type Definitions

import { TrainingPlanner, TrainingPlannerTopic } from './training-planner';

export const EvaluationStage = {
  FIRST: "1st Evaluation",
  SECOND: "2nd Evaluation", 
  THIRD: "3rd Evaluation",
  FINAL: "Final Evaluation"
} as const;

export type EvaluationStageType = typeof EvaluationStage[keyof typeof EvaluationStage];

export const EvaluationStatus = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  MOVED_TO_NEXT: "Moved to Next Evaluation"
} as const;

export type EvaluationStatusType = typeof EvaluationStatus[keyof typeof EvaluationStatus];

export const AttendanceStatus = {
  YES: "Yes",
  NO: "No",
  PENDING: "Pending"
} as const;

export type AttendanceStatusType = typeof AttendanceStatus[keyof typeof AttendanceStatus];

export const RatingType = {
  A: "A",
  B: "B",
  C: "C",
  SATISFACTORY: "Satisfactory",
  NOT_RATED: "Not Rated"
} as const;

export type RatingTypeValue = typeof RatingType[keyof typeof RatingType];

export interface PanelMember {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface PanelMemberComment {
  panelMemberId: string;
  panelMemberName: string;
  comment: string;
}

export interface TopicEvaluationData {
  topicId: string;
  topicName: string;
  trainer: string;
  startDate: string;
  endDate: string;
  attendance?: AttendanceStatusType;
  rating?: RatingTypeValue;
  deviation?: boolean;
  trainerApproved?: boolean;
}

export interface EvaluationRecord {
  id: string;
  plannerId: string;
  stage: EvaluationStageType;
  evaluationDate: string;
  scheduledDate?: string;
  panelMembers: PanelMember[];
  comments: PanelMemberComment[];
  topicsData: TopicEvaluationData[];
  status: EvaluationStatusType;
  planNextEvaluation: boolean;
  nextEvaluationDate?: string;
  createdBy: string;
  createdDate: string;
  completedDate?: string;
}

export interface EvaluationPlanner extends TrainingPlanner {
  currentEvaluationStage: EvaluationStageType;
  firstEvaluationDate: string;
  secondEvaluationDate?: string;
  thirdEvaluationDate?: string;
  evaluationRecords: EvaluationRecord[];
  canEvaluate: boolean;
  evaluationMessage?: string;
  topicsEvaluationData: TopicEvaluationData[];
}

export interface EvaluationFormData {
  plannerId: string;
  stage: EvaluationStageType;
  evaluationDate: string;
  panelMemberIds: string[];
  comments: PanelMemberComment[];
  planNextEvaluation: boolean;
  nextEvaluationDate?: string;
}
