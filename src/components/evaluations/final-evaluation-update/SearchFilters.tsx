import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { mockLocations } from "@/data/mock-training-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface SearchFiltersProps {
  onFilter: (filters: {
    location?: string;
    month?: Date;
  }) => void;
}

export function SearchFilters({ onFilter }: SearchFiltersProps) {
  const [location, setLocation] = useState<string>("");
  const [month, setMonth] = useState<Date>();

  const handleFilter = () => {
    onFilter({
      location: location || undefined,
      month: month || undefined,
    });
  };

  const handleReset = () => {
    setLocation("");
    setMonth(undefined);
    onFilter({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
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
          </div>

          <div className="space-y-2">
            <Label>Evaluation Month</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !month && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {month ? format(month, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={month}
                  onSelect={setMonth}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2 flex items-end gap-2">
            <Button onClick={handleFilter} className="flex-1 ps-button">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
