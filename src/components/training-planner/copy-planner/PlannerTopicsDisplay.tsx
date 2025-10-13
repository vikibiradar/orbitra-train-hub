import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { TrainingPlanner } from "@/types/training-planner";

interface PlannerTopicsDisplayProps {
  planner: TrainingPlanner;
}

export function PlannerTopicsDisplay({ planner }: PlannerTopicsDisplayProps) {
  // Filter out cancelled or removed topics
  const validTopics = planner.topics.filter((topic) => {
    // Exclude topics that are cancelled or removed
    return !topic.isCancelled && !topic.isRemoved;
  });

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Source Planner Topics</CardTitle>
        <CardDescription>
          Review the topics from the source planner. Trainer and Training In-charge fields will not be copied.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Planner Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground">Planner Number</div>
            <div className="font-mono text-sm font-medium">{planner.plannerNumber}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Employee</div>
            <div className="font-medium text-sm">
              {planner.employee.firstName} {planner.employee.lastName}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Type</div>
            <Badge variant="outline">{planner.plannerType === 11 ? "New Employee" : "Annual"}</Badge>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Topics</div>
            <div className="font-medium text-sm">{validTopics.length}</div>
          </div>
        </div>

        {/* Topics Table */}
        {validTopics.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Topic Name</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead className="w-[120px]">Start Date</TableHead>
                  <TableHead className="w-[120px]">End Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validTopics.map((topic, index) => (
                  <TableRow key={topic.id} className="hover:bg-muted/50">
                    <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{topic.topic?.name ?? "-"}</div>
                      <div className="text-xs text-muted-foreground">
                        Duration:{" "}
                        {typeof topic.topic?.defaultDuration === "number" ? `${topic.topic.defaultDuration}h` : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {topic.topic.module?.name ?? "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {Array.isArray(topic.topic?.scopes) && topic.topic.scopes.length > 0
                        ? topic.topic.scopes
                            .map((s: any) => s?.name ?? s)
                            .filter(Boolean)
                            .join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-sm">{format(new Date(topic.startDate), "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-sm">{format(new Date(topic.endDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      {topic.modeOfEvaluation ? (
                        <Badge variant="secondary" className="text-xs">
                          {topic.modeOfEvaluation}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {topic.comments || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Alert>
            <AlertDescription>No valid topics found in the source planner.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
