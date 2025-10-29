// Mock Data for Final Evaluation Records

import { FinalEvaluationRecord, FinalEvaluationResult } from "@/types/final-evaluation";
import { mockFinalEvaluationPlans } from "./mock-final-evaluation-data";

// Convert plans to records with evaluation data
export const mockFinalEvaluationRecords: FinalEvaluationRecord[] = mockFinalEvaluationPlans.map(plan => ({
  ...plan,
  result: FinalEvaluationResult.PENDING,
  panelMemberComments: [],
  isCompleted: false
}));
