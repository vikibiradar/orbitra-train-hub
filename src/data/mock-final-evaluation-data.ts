// Mock Data for Final Evaluation Planning

import { EvaluationPlanner } from "@/types/evaluation";
import { mockEvaluationPlanners, mockPanelMembers } from "./mock-evaluation-data";
import { RatingType, AttendanceStatus } from "@/types/evaluation";

// Get employees eligible for final evaluation
// Criteria: All training topics completed (attendance marked and ratings given)
export const mockEligibleEmployees = mockEvaluationPlanners.filter(planner => {
  // Check if all topics have attendance marked as YES and have ratings
  const allTopicsCompleted = planner.topicsEvaluationData.every(
    topic => 
      topic.attendance === AttendanceStatus.YES && 
      topic.rating !== undefined && 
      topic.rating !== RatingType.NOT_RATED
  );
  
  // Must have at least one topic
  const hasTopics = planner.topicsEvaluationData.length > 0;
  
  return allTopicsCompleted && hasTopics;
});

export interface FinalEvaluationPlan {
  id: string;
  plannerId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  location: string;
  evaluationDate: string;
  evaluationTime: string; // In 12-hour format (e.g., "02:30 PM")
  mainPanelMember: string;
  otherPanelMembers: string[]; // Panel member IDs
  comments: string; // Comma-separated panel member names
  createdDate: string;
  createdBy: string;
}

// Mock planned final evaluations
export const mockFinalEvaluationPlans: FinalEvaluationPlan[] = [
  {
    id: "fe-plan-1",
    plannerId: mockEligibleEmployees[0]?.id || "planner-1",
    employeeName: mockEligibleEmployees[0]?.employee.firstName + " " + mockEligibleEmployees[0]?.employee.lastName || "John Doe",
    employeeCode: mockEligibleEmployees[0]?.employee.employeeCode || "EMP001",
    department: mockEligibleEmployees[0]?.employee.department.name || "PS - Food",
    location: mockEligibleEmployees[0]?.employee.location.name || "Mumbai",
    evaluationDate: "2025-02-20",
    evaluationTime: "10:00 AM",
    mainPanelMember: mockPanelMembers[0].id,
    otherPanelMembers: [mockPanelMembers[1].id, mockPanelMembers[2].id],
    comments: `${mockPanelMembers[1].name}, ${mockPanelMembers[2].name}`,
    createdDate: new Date().toISOString(),
    createdBy: "QA-001"
  }
];

// Export panel members for use in components
export { mockPanelMembers };
