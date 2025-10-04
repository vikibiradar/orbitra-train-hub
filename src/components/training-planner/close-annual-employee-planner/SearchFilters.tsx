import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, MapPin, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockLocations } from "@/data/mock-training-data";

interface FilterState {
  searchTerm?: string;
  location?: string;
  joiningDateFrom?: string;
  joiningDateTo?: string;
  applicableYear?: string;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState<string>("");
  const [joiningDateFrom, setJoiningDateFrom] = useState<Date>();
  const [joiningDateTo, setJoiningDateTo] = useState<Date>();
  const [applicableYear, setApplicableYear] = useState<string>("");

  const hasActiveFilters = searchTerm || location || joiningDateFrom || joiningDateTo || applicableYear;

  const handleSearch = () => {
    onFiltersChange({
      searchTerm: searchTerm || undefined,
      location: location || undefined,
      joiningDateFrom: joiningDateFrom ? format(joiningDateFrom, "yyyy-MM-dd") : undefined,
      joiningDateTo: joiningDateTo ? format(joiningDateTo, "yyyy-MM-dd") : undefined,
      applicableYear: applicableYear || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJoiningDateFrom(undefined);
    setJoiningDateTo(undefined);
    setApplicableYear("");
    onFiltersChange({});
  };

  // Generate year options (current year - 5 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search Term */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Locations" />
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

        {/* Joining Date From */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !joiningDateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {joiningDateFrom ? format(joiningDateFrom, "dd MMM yyyy") : "From Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={joiningDateFrom}
                onSelect={setJoiningDateFrom}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Joining Date To */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !joiningDateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {joiningDateTo ? format(joiningDateTo, "dd MMM yyyy") : "To Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={joiningDateTo}
                onSelect={setJoiningDateTo}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Applicable Year */}
        <div>
          <Select value={applicableYear} onValueChange={setApplicableYear}>
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </Card>
  );
}
