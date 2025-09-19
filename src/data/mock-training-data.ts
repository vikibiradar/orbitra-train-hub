// Mock Data for Training Planner System

import {
  Employee,
  Department,
  Location,
  Trainer,
  TrainingIncharge,
  TrainingTopic,
  TrainingModule,
  TrainingScope,
  TrainingPlanner,
  PlannerType,
  PlannerTypeType,
  PlannerStatus,
  PlannerStatusType,
  ModeOfEvaluation,
  ModeOfEvaluationType
} from "@/types/training-planner";

// Departments
export const mockDepartments: Department[] = [
  { id: "dept-1", name: "PS - Softlines", code: "PS-SL", isPSRelated: true },
  { id: "dept-2", name: "PS - Food", code: "PS-FD", isPSRelated: true },
  { id: "dept-3", name: "PS - Chem", code: "PS-CH", isPSRelated: true },
  { id: "dept-4", name: "PS - Hardlines", code: "PS-HL", isPSRelated: true },
  { id: "dept-5", name: "PS - ENE", code: "PS-ENE", isPSRelated: true },
  { id: "dept-6", name: "PS - Food - Chemical", code: "PS-FC", isPSRelated: true },
  { id: "dept-7", name: "PS - Food - Microbiology", code: "PS-FM", isPSRelated: true },
  { id: "dept-8", name: "PS - Softlines - Physical", code: "PS-SP", isPSRelated: true },
  { id: "dept-9", name: "Quality Assurance", code: "QA", isPSRelated: false },
  { id: "dept-10", name: "Human Resources", code: "HR", isPSRelated: false }
];

// Locations
export const mockLocations: Location[] = [
  { id: "loc-1", name: "Mumbai Lab", code: "MUM", city: "Mumbai", country: "India" },
  { id: "loc-2", name: "Delhi Lab", code: "DEL", city: "Delhi", country: "India" },
  { id: "loc-3", name: "Bangalore Lab", code: "BLR", city: "Bangalore", country: "India" },
  { id: "loc-4", name: "Chennai Lab", code: "CHN", city: "Chennai", country: "India" },
  { id: "loc-5", name: "Pune Lab", code: "PUN", city: "Pune", country: "India" }
];

// Training Modules
export const mockTrainingModules: TrainingModule[] = [
  { id: "mod-1", name: "Safety & Compliance", code: "SC", description: "Safety protocols and compliance training" },
  { id: "mod-2", name: "Technical Skills", code: "TS", description: "Technical competency development" },
  { id: "mod-3", name: "Quality Management", code: "QM", description: "Quality systems and processes" },
  { id: "mod-4", name: "Soft Skills", code: "SS", description: "Communication and interpersonal skills" },
  { id: "mod-5", name: "Product Knowledge", code: "PK", description: "Product-specific knowledge and testing" }
];

// Training Scopes
export const mockTrainingScopes: TrainingScope[] = [
  {
    id: "scope-1",
    name: "Textile Testing",
    code: "TT",
    description: "Complete textile testing procedures",
    departments: [mockDepartments[0], mockDepartments[7]] // PS-Softlines
  },
  {
    id: "scope-2",
    name: "Food Safety",
    code: "FS",
    description: "Food safety and hygiene standards",
    departments: [mockDepartments[1], mockDepartments[5], mockDepartments[6]] // PS-Food related
  },
  {
    id: "scope-3",
    name: "Chemical Analysis",
    code: "CA",
    description: "Chemical testing and analysis methods",
    departments: [mockDepartments[2], mockDepartments[5]] // PS-Chem
  },
  {
    id: "scope-4",
    name: "Product Inspection",
    code: "PI",
    description: "Physical product inspection standards",
    departments: [mockDepartments[3]] // PS-Hardlines
  },
  {
    id: "scope-5",
    name: "Energy Efficiency",
    code: "EE",
    description: "Energy and environmental testing",
    departments: [mockDepartments[4]] // PS-ENE
  }
];

// Training Topics
export const mockTrainingTopics: TrainingTopic[] = [
  {
    id: "topic-1",
    name: "Laboratory Safety Protocols",
    code: "LSP-001",
    description: "Basic laboratory safety and emergency procedures",
    module: mockTrainingModules[0],
    defaultDuration: 8,
    scopes: [mockTrainingScopes[0], mockTrainingScopes[1], mockTrainingScopes[2]],
    isActive: true
  },
  {
    id: "topic-2",
    name: "Fabric Testing Standards",
    code: "FTS-001",
    description: "ISO standards for textile testing",
    module: mockTrainingModules[1],
    defaultDuration: 16,
    scopes: [mockTrainingScopes[0]],
    isActive: true
  },
  {
    id: "topic-3",
    name: "Food Microbiology Basics",
    code: "FMB-001",
    description: "Microbiological testing in food samples",
    module: mockTrainingModules[1],
    defaultDuration: 24,
    scopes: [mockTrainingScopes[1]],
    isActive: true
  },
  {
    id: "topic-4",
    name: "Chemical Analysis Techniques",
    code: "CAT-001",
    description: "Advanced chemical analysis methods",
    module: mockTrainingModules[1],
    defaultDuration: 20,
    scopes: [mockTrainingScopes[2]],
    isActive: true
  },
  {
    id: "topic-5",
    name: "Quality Documentation",
    code: "QD-001",
    description: "Documentation and record keeping",
    module: mockTrainingModules[2],
    defaultDuration: 6,
    scopes: mockTrainingScopes,
    isActive: true
  },
  {
    id: "topic-6",
    name: "Customer Communication",
    code: "CC-001",
    description: "Effective client communication strategies",
    module: mockTrainingModules[3],
    defaultDuration: 8,
    scopes: mockTrainingScopes,
    isActive: true
  },
  {
    id: "topic-7",
    name: "Product Inspection Methods",
    code: "PIM-001",
    description: "Visual and dimensional inspection techniques",
    module: mockTrainingModules[1],
    defaultDuration: 12,
    scopes: [mockTrainingScopes[3]],
    isActive: true
  },
  {
    id: "topic-8",
    name: "Energy Testing Protocols",
    code: "ETP-001",
    description: "Energy efficiency testing procedures",
    module: mockTrainingModules[1],
    defaultDuration: 14,
    scopes: [mockTrainingScopes[4]],
    isActive: true
  }
];

// Trainers
export const mockTrainers: Trainer[] = [
  {
    id: "trainer-1",
    employeeCode: "TUV001",
    
    name: "Tushar Maske",
    email: "tushar.maske@tuvsud.com",
    department: mockDepartments[0],
    specializations: ["Textile Testing", "Quality Systems"],
    isActive: true
  },
  {
    id: "trainer-2",
    employeeCode: "TUV002",
    
name: "Mayuri Manikpure",
email: "mayuri.manikpure@tuvsud.com",
    department: mockDepartments[1],
    specializations: ["Food Safety", "Microbiology"],
    isActive: true
  },
  {
    id: "trainer-3",
    employeeCode: "TUV003",
    
name: "Akshay Dhumal",
email: "akshay.dhumal@tuvsud.com",
    department: mockDepartments[2],
    specializations: ["Chemical Analysis", "Analytical Chemistry"],
    isActive: true
  },
  {
    id: "trainer-4",
    employeeCode: "TUV004",
   
name: "Tejas Kashid",
email: "tejas.kashid@tuvsud.com"
,
    department: mockDepartments[3],
    specializations: ["Product Inspection", "Quality Control"],
    isActive: true
  },
  {
    id: "trainer-5",
    employeeCode: "TUV005",
    
name: "Chetan Magar",
email: "chetan.magar@tuvsud.com"
,
    department: mockDepartments[4],
    specializations: ["Energy Testing", "Environmental Standards"],
    isActive: true
  },
  {
    id: "trainer-6",
    employeeCode: "TUV006",

name: "Lalit Sinkar",
email: "lalit.sinkar@tuvsud.com"
,
    department: mockDepartments[0],
    specializations: ["Laboratory Safety", "Training Management"],
    isActive: true
  }
];

// Training Incharges
export const mockTrainingIncharges: TrainingIncharge[] = [
  {
    id: "ti-1",
    employeeCode: "TUV101",
name: "Tejas Kashid",
email: "tejas.kashid@tuvsud.com",
    department: mockDepartments[0],
    isActive: true
  },
  {
    id: "ti-2",
    employeeCode: "TUV102",
    name: "Ms. Anjali Verma",
    email: "anjali.verma@tuvsud.com",
    department: mockDepartments[1],
    isActive: true
  },
  {
    id: "ti-3",
    employeeCode: "TUV103",
    name: "Dr. Suresh Reddy",
    email: "suresh.reddy@tuvsud.com",
    department: mockDepartments[2],
    isActive: true
  }
];

// New Employees (for New Employee Planner)
export const mockNewEmployees: Employee[] = [
  {
    id: "emp-1",
    employeeCode: "TUV2024001",
    employeeADID: "new.employee1",
    firstName: "Vikram",
    lastName: "Biradar",
    email: "Vikram.Biradar@tuvsud.com",
    department: mockDepartments[0], // PS-Softlines
    location: mockLocations[0], // Mumbai
    joiningDate: "2025-01-15",
    isResigned: false,
    applicableYear: 2024
  },
  {
    id: "emp-2",
    employeeCode: "TUV2024002",
    employeeADID: "new.employee2",
    firstName: "Tushar",
    lastName: "Maske",
    email: "Tushar.Maske@tuvsud.com",
    department: mockDepartments[1], // PS-Food
    location: mockLocations[1], // Delhi
    joiningDate: "2025-02-01",
    isResigned: false,
    applicableYear: 2024
  },
  {
    id: "emp-3",
    employeeCode: "TUV2024003",
    employeeADID: "new.employee3",
    firstName: "Akshay",
    lastName: "Dhuman",
    email: "Akshay.Dhumal@tuvsud.com",
    department: mockDepartments[2], // PS-Chem
    location: mockLocations[2], // Bangalore
    joiningDate: "2025-01-20",
    isResigned: false,
    applicableYear: 2024
  },
  {
    id: "emp-4",
    employeeCode: "TUV2024004",
    employeeADID: "new.employee4",
    firstName: "Mayuri",
    lastName: "Manikpure",
    email: "Mayuri.Manikpure@tuvsud.com",
    department: mockDepartments[3], // PS-Hardlines
    location: mockLocations[0], // Mumbai
    joiningDate: "2025-02-10",
    isResigned: false,
    applicableYear: 2024
  },
  {
    id: "emp-5",
    employeeCode: "TUV2024005",
    employeeADID: "new.employee5",
    firstName: "Mayuri",
    lastName: "Manikpure",
    email: "Mayuri.Manikpure@tuvsud.com",
    department: mockDepartments[4], // PS-ENE
    location: mockLocations[3], // Chennai
    joiningDate: "2025-01-25",
    isResigned: false,
    applicableYear: 2024
  },
  {
    id: "emp-6",
    employeeCode: "TUV2024006",
    employeeADID: "new.employee6",
    firstName: "Rohini",
    lastName: "Raut",
    email: "Rohini.Raut@tuvsud.com",
    department: mockDepartments[5], // PS-Food-Chemical
    location: mockLocations[4], // Pune
    joiningDate: "2025-02-15",
    isResigned: false,
    applicableYear: 2024
  }
];

// Mode of Evaluation Options
export const modeOfEvaluationOptions = [
  { value: ModeOfEvaluation.QUESTION_PAPER, label: ModeOfEvaluation.QUESTION_PAPER },
  { value: ModeOfEvaluation.PERSONNEL_INTERVIEW, label: ModeOfEvaluation.PERSONNEL_INTERVIEW },
  { value: ModeOfEvaluation.REPLICATE_TESTING, label: ModeOfEvaluation.REPLICATE_TESTING },
  { value: ModeOfEvaluation.RETESTING, label: ModeOfEvaluation.RETESTING },
  { value: ModeOfEvaluation.SPIKE_RECOVERY, label: ModeOfEvaluation.SPIKE_RECOVERY },
  { value: ModeOfEvaluation.GROUP_DISCUSSION, label: ModeOfEvaluation.GROUP_DISCUSSION },
  { value: ModeOfEvaluation.EXTERNAL_EVALUATION, label: ModeOfEvaluation.EXTERNAL_EVALUATION }
];

// Sample existing planners (for demonstration)
export const mockExistingPlanners: TrainingPlanner[] = [
  {
    id: "planner-1",
    plannerNumber: "PLNR_TUV2024001_NEW",
    employee: mockNewEmployees[0],
    plannerType: PlannerType.GENERAL_NEW_EMPLOYEE,
    trainingIncharge: mockTrainingIncharges[0],
    proposedFirstEvaluationDate: "2025-03-15",
    selectedScopes: [mockTrainingScopes[0]],
    topics: [
      {
        id: "topic-plan-1",
        topic: mockTrainingTopics[0],
        trainer: mockTrainers[5],
        startDate: "2025-02-01",
        endDate: "2025-02-01",
        modeOfEvaluation: ModeOfEvaluation.QUESTION_PAPER,
        comments: "Basic safety training for new joiner"
      },
      {
        id: "topic-plan-2",
        topic: mockTrainingTopics[1],
        trainer: mockTrainers[0],
        startDate: "2025-02-05",
        endDate: "2025-02-07",
        modeOfEvaluation: ModeOfEvaluation.PERSONNEL_INTERVIEW,
        comments: "Textile testing fundamentals"
      }
    ],
    status: PlannerStatus.APPROVED,
    createdBy: "TM001",
    createdDate: "2024-01-20",
    submittedDate: "2025-01-22",
    approvedDate: "2025-01-25"
  },
  // Submitted planners for TI approval
  {
    id: "planner-2",
    employee: mockNewEmployees[1],
    plannerType: PlannerType.GENERAL_NEW_EMPLOYEE,
    trainingIncharge: mockTrainingIncharges[1],
    proposedFirstEvaluationDate: "2025-03-20",
    selectedScopes: [mockTrainingScopes[1]],
    topics: [
      {
        id: "topic-plan-3",
        topic: mockTrainingTopics[0],
        trainer: mockTrainers[5],
        startDate: "2025-02-15",
        endDate: "2025-02-15",
        modeOfEvaluation: ModeOfEvaluation.QUESTION_PAPER,
        comments: "Safety training for food department"
      },
      {
        id: "topic-plan-4",
        topic: mockTrainingTopics[2],
        trainer: mockTrainers[1],
        startDate: "2025-02-20",
        endDate: "2025-02-23",
        modeOfEvaluation: ModeOfEvaluation.REPLICATE_TESTING,
        comments: "Food microbiology fundamentals",
        isNew: true
      }
    ],
    status: PlannerStatus.SUBMITTED,
    createdBy: "TM002",
    createdDate: "2025-01-25",
    submittedDate: "2025-01-28"
  },
  {
    id: "planner-3",
    employee: mockNewEmployees[2],
    plannerType: PlannerType.SCOPE_NEW_EMPLOYEE,
    trainingIncharge: mockTrainingIncharges[2],
    proposedFirstEvaluationDate: "2025-03-25",
    selectedScopes: [mockTrainingScopes[2]],
    topics: [
      {
        id: "topic-plan-5",
        topic: mockTrainingTopics[0],
        trainer: mockTrainers[5],
        startDate: "2025-02-10",
        endDate: "2025-02-10",
        modeOfEvaluation: ModeOfEvaluation.QUESTION_PAPER,
        comments: "Laboratory safety protocols"
      },
      {
        id: "topic-plan-6",
        topic: mockTrainingTopics[3],
        trainer: mockTrainers[2],
        startDate: "2025-02-25",
        endDate: "2025-03-01",
        modeOfEvaluation: ModeOfEvaluation.PERSONNEL_INTERVIEW,
        comments: "Chemical analysis techniques training"
      }
    ],
    status: PlannerStatus.SUBMITTED,
    createdBy: "TM003",
    createdDate: "2025-01-22",
    submittedDate: "2025-01-26"
  },
  {
    id: "planner-4",
    employee: mockNewEmployees[3],
    plannerType: PlannerType.GENERAL_NEW_EMPLOYEE,
    trainingIncharge: mockTrainingIncharges[0],
    proposedFirstEvaluationDate: "2025-04-01",
    selectedScopes: [mockTrainingScopes[3]],
    topics: [
      {
        id: "topic-plan-7",
        topic: mockTrainingTopics[0],
        trainer: mockTrainers[5],
        startDate: "2025-03-01",
        endDate: "2025-03-01",
        modeOfEvaluation: ModeOfEvaluation.QUESTION_PAPER,
        comments: "Safety training for hardlines"
      },
      {
        id: "topic-plan-8",
        topic: mockTrainingTopics[6],
        trainer: mockTrainers[3],
        startDate: "2025-03-05",
        endDate: "2025-03-07",
        modeOfEvaluation: ModeOfEvaluation.REPLICATE_TESTING,
        comments: "Product inspection methods",
        isNew: true
      },
      {
        id: "topic-plan-9",
        topic: mockTrainingTopics[4],
        trainer: mockTrainers[0],
        startDate: "2025-03-10",
        endDate: "2025-03-11",
        modeOfEvaluation: ModeOfEvaluation.GROUP_DISCUSSION,
        comments: "Quality documentation training",
        isNew: true
      }
    ],
    status: PlannerStatus.SUBMITTED,
    createdBy: "TM001",
    createdDate: "2025-01-20",
    submittedDate: "2025-01-30"
  },
  {
    id: "planner-5",
    employee: mockNewEmployees[4],
    plannerType: PlannerType.SCOPE_NEW_EMPLOYEE,
    trainingIncharge: mockTrainingIncharges[0],
    proposedFirstEvaluationDate: "2025-04-05",
    selectedScopes: [mockTrainingScopes[4]],
    topics: [
      {
        id: "topic-plan-10",
        topic: mockTrainingTopics[0],
        trainer: mockTrainers[5],
        startDate: "2025-03-05",
        endDate: "2025-03-05",
        modeOfEvaluation: ModeOfEvaluation.QUESTION_PAPER,
        comments: "Safety protocols for energy department"
      },
      {
        id: "topic-plan-11",
        topic: mockTrainingTopics[7],
        trainer: mockTrainers[4],
        startDate: "2025-03-12",
        endDate: "2025-03-14",
        modeOfEvaluation: ModeOfEvaluation.PERSONNEL_INTERVIEW,
        comments: "Energy testing protocols fundamentals"
      }
    ],
    status: PlannerStatus.SUBMITTED,
    createdBy: "TM004",
    createdDate: "2025-01-18",
    submittedDate: "2025-01-31"
  }
];

// Utility functions for data filtering
export const getTrainersByDepartment = (departmentId: string): Trainer[] => {
  return mockTrainers.filter(trainer => trainer.department.id === departmentId && trainer.isActive);
};

export const getTopicsByScope = (scopeIds: string[]): TrainingTopic[] => {
  return mockTrainingTopics.filter(topic => 
    topic.isActive && 
    topic.scopes.some(scope => scopeIds.includes(scope.id))
  );
};

export const getActiveTrainingIncharges = (): TrainingIncharge[] => {
  return mockTrainingIncharges.filter(ti => ti.isActive);
};

export const getNewEmployeesByDepartment = (departmentIds: string[]): Employee[] => {
  return mockNewEmployees.filter(emp => 
    departmentIds.includes(emp.department.id) && !emp.isResigned
  );
};

// Get planners by status for approval workflow
export const getPlannersByStatus = (status: PlannerStatusType): TrainingPlanner[] => {
  return mockExistingPlanners.filter(planner => planner.status === status);
};

// Get submitted planners for TI approval
export const getSubmittedPlanners = (): TrainingPlanner[] => {
  return getPlannersByStatus(PlannerStatus.SUBMITTED);
};