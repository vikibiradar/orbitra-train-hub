import { useState } from "react";
import { MessageSquare, ClipboardCheck, Search, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FinalEvaluationRecord, FinalEvaluationResult } from "@/types/final-evaluation";
import { mockLocations } from "@/data/mock-training-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FinalEvaluationListProps {
  records: FinalEvaluationRecord[];
  onOpenComments: (record: FinalEvaluationRecord) => void;
  onOpenResult: (record: FinalEvaluationRecord) => void;
  onFilter: (filters: { location?: string; month?: Date; searchTerm?: string }) => void;
}

export function FinalEvaluationList({
  records,
  onOpenComments,
  onOpenResult,
  onFilter,
}: FinalEvaluationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState<string>("all");
  const [month, setMonth] = useState<Date>();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilter({ location: location !== "all" ? location : undefined, month, searchTerm: value });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onFilter({ location: value !== "all" ? value : undefined, month, searchTerm });
  };

  const handleMonthChange = (date: Date | undefined) => {
    setMonth(date);
    onFilter({ location: location !== "all" ? location : undefined, month: date, searchTerm });
  };
  const getResultBadge = (result?: string) => {
    if (!result || result === FinalEvaluationResult.PENDING) {
      return <Badge variant="outline">Pending</Badge>;
    }
    if (result === FinalEvaluationResult.SATISFACTORY) {
      return <Badge className="bg-success text-white">Satisfactory</Badge>;
    }
    if (result === FinalEvaluationResult.NEED_RETRAINING) {
      return <Badge className="bg-warning text-white">Need re-Training</Badge>;
    }
    if (result === FinalEvaluationResult.BELOW_SATISFACTORY) {
      return <Badge variant="destructive">Below Satisfactory</Badge>;
    }
    return <Badge variant="outline">{result}</Badge>;
  };

  return (
    <div className="space-y-4 p-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee name, code, or department..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={location} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {mockLocations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !month && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {month ? format(month, "MMMM yyyy") : "Filter by month"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={month}
              onSelect={handleMonthChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
              <TableHead className="text-white font-semibold">Employee Code</TableHead>
              <TableHead className="text-white font-semibold">Employee Name</TableHead>
              <TableHead className="text-white font-semibold">Department</TableHead>
              <TableHead className="text-white font-semibold">Location</TableHead>
              <TableHead className="text-white font-semibold">Evaluation Date</TableHead>
              <TableHead className="text-white font-semibold">Evaluation Time</TableHead>
              <TableHead className="text-white font-semibold">Main Panel Member</TableHead>
              <TableHead className="text-right text-white font-semibold">Comments</TableHead>
              <TableHead className="text-center text-white font-semibold">Result</TableHead>
              <TableHead className="text-center text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No final evaluations found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{record.employeeCode}</TableCell>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>
                    {format(new Date(record.evaluationDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>{record.evaluationTime}</TableCell>
                  <TableCell>
                    {record.mainPanelMember ? `Panel-${record.mainPanelMember.slice(-3)}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{record.panelMemberComments.length}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{getResultBadge(record.result)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenComments(record)}
                        className="bg-ps-primary hover:bg-ps-primary/90 text-white border-ps-primary"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comments
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onOpenResult(record)}
                        disabled={record.isCompleted}
                        className="bg-ps-primary hover:bg-ps-primary/90"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-1" />
                        {record.isCompleted ? "Completed" : "Save Result"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
