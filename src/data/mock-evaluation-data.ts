// Mock Data for Evaluation System

import {
  EvaluationPlanner,
  EvaluationRecord,
  EvaluationStage,
  EvaluationStatus,
  PanelMember,
  TopicEvaluationData,
  AttendanceStatus,
  RatingType
} from "@/types/evaluation";
import { PlannerStatus } from "@/types/training-planner";
import { mockExistingPlanners, mockDepartments } from "./mock-training-data";

// Panel Members (TMs, TIs, QA personnel)
export const mockPanelMembers: PanelMember[] = [
  {
    id: "panel-1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@tuvsud.com",
    department: "Quality Assurance"
  },
  {
    id: "panel-2",
    name: "Ms. Anjali Verma",
    email: "anjali.verma@tuvsud.com",
    department: "PS - Food"
  },
  {
    id: "panel-3",
    name: "Mr. Suresh Reddy",
    email: "suresh.reddy@tuvsud.com",
    department: "PS - Chem"
  },
  {
    id: "panel-4",
    name: "Ms. Priya Sharma",
    email: "priya.sharma@tuvsud.com",
    department: "PS - Softlines"
  },
  {
    id: "panel-5",
    name: "Mr. Amit Kulkarni",
    email: "amit.kulkarni@tuvsud.com",
    department: "Quality Assurance"
  }
];

// Get approved planners for evaluation
const approvedPlanners = mockExistingPlanners.filter(
  planner => planner.status === PlannerStatus.APPROVED
);

// Mock Evaluation Planners
export const mockEvaluationPlanners: EvaluationPlanner[] = approvedPlanners.map((planner, index) => {
  const baseDate = new Date(planner.proposedFirstEvaluationDate || "2025-02-15");
  const firstEvalDate = new Date(baseDate);
  firstEvalDate.setDate(firstEvalDate.getDate() - 5); // 5 days before today for testing

  // Determine if first training has started
  const firstTrainingDate = new Date(
    planner.topics.length > 0 ? planner.topics[0].startDate : new Date()
  );
  const today = new Date();
  const canEvaluate = firstTrainingDate <= today && firstEvalDate <= today;

  // Mock topics evaluation data
  const topicsEvaluationData: TopicEvaluationData[] = planner.topics.map((topic, idx) => ({
    topicId: topic.id,
    topicName: topic.topic.name,
    trainer: topic.trainer?.name || "Not Assigned",
    startDate: topic.startDate,
    endDate: topic.endDate,
    attendance: idx % 3 === 0 ? AttendanceStatus.YES : idx % 3 === 1 ? AttendanceStatus.NO : AttendanceStatus.PENDING,
    rating: idx % 4 === 0 ? RatingType.A : idx % 4 === 1 ? RatingType.B : idx % 4 === 2 ? RatingType.SATISFACTORY : RatingType.NOT_RATED,
    deviation: idx % 5 === 0,
    trainerApproved: true
  }));

  // Check if at least one topic has attendance as YES
  const hasAttendance = topicsEvaluationData.some(
    topic => topic.attendance === AttendanceStatus.YES
  );

  let evaluationMessage: string | undefined;
  if (!canEvaluate) {
    evaluationMessage = "First training date has not passed yet. Evaluation cannot be conducted.";
  } else if (!hasAttendance) {
    evaluationMessage = "At least one topic must have attendance as YES. 1st evaluation cannot be conducted now.";
  }

  return {
    ...planner,
    currentEvaluationStage: EvaluationStage.FIRST,
    firstEvaluationDate: firstEvalDate.toISOString().split('T')[0],
    secondEvaluationDate: index % 2 === 0 ? new Date(firstEvalDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    thirdEvaluationDate: index % 3 === 0 ? new Date(firstEvalDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    evaluationRecords: [],
    canEvaluate: canEvaluate && hasAttendance,
    evaluationMessage,
    topicsEvaluationData
  };
});

// Helper function to get evaluation planners by stage
export function getEvaluationPlannersByStage(stage: string): EvaluationPlanner[] {
  return mockEvaluationPlanners.filter(
    planner => planner.currentEvaluationStage === stage && planner.canEvaluate
  );
}

// Helper function to get planner by ID
export function getEvaluationPlannerById(id: string): EvaluationPlanner | undefined {
  return mockEvaluationPlanners.find(planner => planner.id === id);
}

// Helper function to check if all topics are rated
export function areAllTopicsRated(planner: EvaluationPlanner): boolean {
  return planner.topicsEvaluationData.every(
    topic => topic.rating && topic.rating !== RatingType.NOT_RATED
  );
}

// Helper function to check if planner can move to final evaluation
export function canMoveToFinalEvaluation(
  planner: EvaluationPlanner,
  evaluationDate: string
): { canMove: boolean; reason?: string } {
  // Check if all topics are rated
  if (!areAllTopicsRated(planner)) {
    return {
      canMove: false,
      reason: "This employee planner cannot be taken directly for final evaluation as one or more of the planned trainings are still incomplete"
    };
  }

  // Check if there are unapproved topics by TI
  const hasUnapprovedTopics = planner.topicsEvaluationData.some(
    topic => !topic.trainerApproved
  );
  
  if (hasUnapprovedTopics) {
    return {
      canMove: false,
      reason: "There are one or more topics in this planner which are not approved by TI and hence the planner cannot be moved to Final evaluation."
    };
  }

  // Check if all training end dates are before evaluation date
  const evalDate = new Date(evaluationDate);
  const hasFutureTraining = planner.topicsEvaluationData.some(
    topic => new Date(topic.endDate) > evalDate
  );

  if (hasFutureTraining) {
    // Check if attendance and remarks are completed for all
    const allCompleted = planner.topicsEvaluationData.every(
      topic => topic.attendance && topic.rating && topic.rating !== RatingType.NOT_RATED
    );
    
    if (!allCompleted) {
      return {
        canMove: false,
        reason: "Training end dates are in future and not all trainings have completed attendance and remarks."
      };
    }
  }

  return { canMove: true };
}
