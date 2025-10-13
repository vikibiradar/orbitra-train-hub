import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Users } from "lucide-react";
interface EmployeeTypeSelectorProps {
  employeeType: "New" | "Annual" | "";
  onEmployeeTypeChange: (type: "New" | "Annual" | "") => void;
}
export function EmployeeTypeSelector({
  employeeType,
  onEmployeeTypeChange
}: EmployeeTypeSelectorProps) {
  return <div className="space-y-3">
      <Label className="text-base font-semibold">
        Employee Type <span className="text-destructive">*</span>
      </Label>
      
      <Select value={employeeType} onValueChange={value => onEmployeeTypeChange(value as "New" | "Annual" | "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Employee Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>New Employee</span>
            </div>
          </SelectItem>
          <SelectItem value="Annual">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Annual Employee</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>;
}