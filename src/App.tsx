import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { NewEmployeePlannerPage } from "./components/training-planner/new-employee-planner/NewEmployeePlannerPage";
import { ApproveNewEmployeePlannerPage } from "./components/training-planner/approve-new/ApproveNewEmployeePlannerPage";
import { EditEmployeePlannerPage } from "./components/training-planner/edit-employee-planner/EditEmployeePlannerPage";
import { CloseAnnualEmployeePlannerPage } from "./components/training-planner/close-annual-employee-planner/CloseAnnualEmployeePlannerPage";
import { AnnualEmployeePlannerPage } from "./components/training-planner/annual-employee-planner/AnnualEmployeePlannerPage";
import { UpdateAdditionalTrainingPage } from "./components/training-planner/update-additional-training/UpdateAdditionalTrainingPage";
import { PrintPlannerPage } from "./components/training-planner/print-planner/PrintPlannerPage";
import { CopyPlannerPage } from "./components/training-planner/copy-planner/CopyPlannerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/training-planner/new-employee" element={<NewEmployeePlannerPage />} />
          <Route path="/training-planner/approve-new" element={<ApproveNewEmployeePlannerPage />} />
          <Route path="/training-planner/edit" element={<EditEmployeePlannerPage />} />
          <Route path="/training-planner/close-annual" element={<CloseAnnualEmployeePlannerPage />} />
          <Route path="/training-planner/annual" element={<AnnualEmployeePlannerPage />} />
          <Route path="/training-planner/print" element={<PrintPlannerPage />} />
          <Route path="/training-planner/copy-planner" element={<CopyPlannerPage />} />
          <Route path="/training-planner/update-additional" element={<UpdateAdditionalTrainingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
