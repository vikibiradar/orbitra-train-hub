import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, X } from "lucide-react";
import { mockLocations } from "@/data/mock-training-data";

interface FilterState {
  searchTerm?: string;
  location?: string;
  applicableYear?: string;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState<string>("");
  const [applicableYear, setApplicableYear] = useState<string>("");

  const hasActiveFilters = searchTerm || location || applicableYear;

  const handleSearch = () => {
    onFiltersChange({
      searchTerm: searchTerm || undefined,
      location: location || undefined,
      applicableYear: applicableYear || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setApplicableYear("");
    onFiltersChange({});
  };

  // Generate year options (current year - 5 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Term */}
        <div className="flex-1 w-full">
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
        <div className="w-full md:w-48">
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

        {/* Applicable Year */}
        <div className="w-full md:w-40">
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
      <div className="flex justify-center md:justify-end gap-2 mt-4">
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
