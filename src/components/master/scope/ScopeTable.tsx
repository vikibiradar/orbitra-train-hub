import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search } from "lucide-react";
import { Scope } from "@/types/scope";
import { format } from "date-fns";

interface ScopeTableProps {
  scopes: Scope[];
  onEdit: (scope: Scope) => void;
  onDelete: (scope: Scope) => void;
}

export const ScopeTable = ({ scopes, onEdit, onDelete }: ScopeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScopes = scopes.filter((scope) =>
    scope.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scope title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark">
              <TableHead className="text-white font-bold">S.No</TableHead>
              <TableHead className="text-white font-bold">Scope Title</TableHead>
              <TableHead className="text-white font-bold">Created Date</TableHead>
              <TableHead className="text-white font-bold">Updated Date</TableHead>
              <TableHead className="text-white font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScopes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No scopes found
                </TableCell>
              </TableRow>
            ) : (
              filteredScopes.map((scope, index) => (
                <TableRow key={scope.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{scope.title}</TableCell>
                  <TableCell>{format(scope.createdAt, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{format(scope.updatedAt, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(scope)}
                        className="h-8 w-8 p-0 hover:bg-ps-primary/10"
                      >
                        <Pencil className="h-4 w-4 text-ps-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(scope)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
};
