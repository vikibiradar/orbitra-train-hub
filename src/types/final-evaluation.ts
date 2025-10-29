// Final Evaluation Type Definitions

import { FinalEvaluationPlan } from "@/data/mock-final-evaluation-data";

export const FinalEvaluationResult = {
  SATISFACTORY: "Satisfactory",
  NEED_RETRAINING: "Need re-Training",
  BELOW_SATISFACTORY: "Below Satisfactory",
  PENDING: "Pending"
} as const;

export type FinalEvaluationResultType = typeof FinalEvaluationResult[keyof typeof FinalEvaluationResult];

export interface PanelMemberEvaluationComment {
  panelMemberId: string;
  panelMemberName: string;
  comment: string;
  commentDate: string;
}

export interface FinalEvaluationRecord extends FinalEvaluationPlan {
  result?: FinalEvaluationResultType;
  resultComments?: string;
  panelMemberComments: PanelMemberEvaluationComment[];
  completedDate?: string;
  completedBy?: string;
  isCompleted: boolean;
}
