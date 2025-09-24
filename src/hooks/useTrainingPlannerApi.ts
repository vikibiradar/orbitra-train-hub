// React Query hooks for Training Planner API

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingPlannerApi } from '@/api/training-planner/TrainingPlannerApiService';
import { useToast } from '@/hooks/use-toast';
import {
  CreatePlannerRequest,
  UpdatePlannerRequest,
  PlannerListRequest,
  EmployeeListRequest,
  ApprovalRequest,
  RejectionRequest
} from '@/api/training-planner/types';

// Query Keys
export const trainingPlannerKeys = {
  all: ['training-planner'] as const,
  planners: () => [...trainingPlannerKeys.all, 'planners'] as const,
  planner: (id: string) => [...trainingPlannerKeys.all, 'planner', id] as const,
  employees: () => [...trainingPlannerKeys.all, 'employees'] as const,
  lookups: () => [...trainingPlannerKeys.all, 'lookups'] as const,
  statistics: () => [...trainingPlannerKeys.all, 'statistics'] as const,
};

// Planner Queries
export const usePlanners = (request: PlannerListRequest = {}) => {
  return useQuery({
    queryKey: [...trainingPlannerKeys.planners(), request],
    queryFn: () => trainingPlannerApi.getPlanners(request),
    select: (data) => data.success ? data.data : [],
  });
};

export const usePlanner = (id: string) => {
  return useQuery({
    queryKey: trainingPlannerKeys.planner(id),
    queryFn: () => trainingPlannerApi.getPlanner(id),
    select: (data) => data.success ? data.data : null,
    enabled: !!id,
  });
};

export const useSubmittedPlanners = () => {
  return useQuery({
    queryKey: [...trainingPlannerKeys.planners(), 'submitted'],
    queryFn: () => trainingPlannerApi.getSubmittedPlanners(),
    select: (data) => data.success ? data.data : [],
  });
};

export const useDraftPlanners = () => {
  return useQuery({
    queryKey: [...trainingPlannerKeys.planners(), 'draft'],
    queryFn: () => trainingPlannerApi.getDraftPlanners(),
    select: (data) => data.success ? data.data : [],
  });
};

// Employee Queries
export const useEmployees = (request: EmployeeListRequest = {}) => {
  return useQuery({
    queryKey: [...trainingPlannerKeys.employees(), request],
    queryFn: () => trainingPlannerApi.getEmployees(request),
    select: (data) => data.success ? data.data : [],
  });
};

// Lookup Queries
export const useTrainingPlannerLookups = () => {
  return useQuery({
    queryKey: trainingPlannerKeys.lookups(),
    queryFn: () => trainingPlannerApi.getLookups(),
    select: (data) => data.success ? data.data : null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Statistics Query
export const usePlannerStatistics = () => {
  return useQuery({
    queryKey: trainingPlannerKeys.statistics(),
    queryFn: () => trainingPlannerApi.getStatistics(),
    select: (data) => data.success ? data.data : null,
  });
};

// Mutations
export const useCreatePlanner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: CreatePlannerRequest) => 
      trainingPlannerApi.createPlanner(request),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planners() });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.statistics() });
        toast({
          title: "Success",
          description: "Training planner created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to create planner",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create planner",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePlanner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: UpdatePlannerRequest) => 
      trainingPlannerApi.updatePlanner(request),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planners() });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planner(variables.id) });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.statistics() });
        toast({
          title: "Success",
          description: "Training planner updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to update planner",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update planner",
        variant: "destructive",
      });
    },
  });
};

export const useSubmitPlanner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => trainingPlannerApi.submitPlanner(id),
    onSuccess: (data, id) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planners() });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planner(id) });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.statistics() });
        toast({
          title: "Success",
          description: "Training planner submitted for approval",
        });
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to submit planner",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit planner",
        variant: "destructive",
      });
    },
  });
};

export const useApprovePlanner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: ApprovalRequest) => 
      trainingPlannerApi.approvePlanner(request),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planners() });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planner(variables.plannerId) });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.statistics() });
        toast({
          title: "Success",
          description: "Training planner approved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to approve planner",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve planner",
        variant: "destructive",
      });
    },
  });
};

export const useRejectPlanner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: RejectionRequest) => 
      trainingPlannerApi.rejectPlanner(request),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planners() });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.planner(variables.plannerId) });
        queryClient.invalidateQueries({ queryKey: trainingPlannerKeys.statistics() });
        toast({
          title: "Rejected",
          description: "Training planner rejected",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to reject planner",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject planner",
        variant: "destructive",
      });
    },
  });
};