import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTrainingPlannerLookups } from "@/hooks/useTrainingPlannerApi";

interface FilterState {
  location?: string;
  joiningDateFrom?: string;
  joiningDateTo?: string;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const { toast } = useToast();
  const { data: lookups, isLoading } = useTrainingPlannerLookups();
  const [filters, setFilters] = useState<FilterState>({});
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const handleLocationChange = (value: string) => {
    const newFilters = { ...filters, location: value };
    setFilters(newFilters);
  };

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    const newFilters = { 
      ...filters, 
      joiningDateFrom: date ? format(date, 'yyyy-MM-dd') : undefined 
    };
    setFilters(newFilters);
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    const newFilters = { 
      ...filters, 
      joiningDateTo: date ? format(date, 'yyyy-MM-dd') : undefined 
    };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Validation: at least one filter must be selected
    if (!filters.location && !filters.joiningDateFrom && !filters.joiningDateTo) {
      toast({
        title: "Validation Error",
        description: "Please select either Joining Date or Location to search.",
        variant: "destructive"
      });
      return;
    }
    
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    setFromDate(undefined);
    setToDate(undefined);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof FilterState]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Location Filter */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select 
              value={filters.location || ""} 
              onValueChange={handleLocationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {lookups?.locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          {/* From Date */}
          <div className="space-y-2">
            <Label>Joining Date From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "dd MMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={handleFromDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label>Joining Date To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "dd MMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={handleToDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleSearch} className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};