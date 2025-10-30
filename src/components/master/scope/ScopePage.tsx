import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockScopes } from "@/data/mock-scope-data";
import { Scope } from "@/types/scope";
import { ScopeTable } from "./ScopeTable";
import { ScopeFormModal } from "./ScopeFormModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { toast } from "@/hooks/use-toast";

export const ScopePage = () => {
  const [scopes, setScopes] = useState<Scope[]>(mockScopes);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedScope, setSelectedScope] = useState<Scope | null>(null);
  const [scopeToDelete, setScopeToDelete] = useState<Scope | null>(null);

  const handleAddNew = () => {
    setSelectedScope(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (scope: Scope) => {
    setSelectedScope(scope);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (scope: Scope) => {
    setScopeToDelete(scope);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (data: { title: string }) => {
    if (selectedScope) {
      // Update existing scope
      setScopes(
        scopes.map((scope) =>
          scope.id === selectedScope.id
            ? { ...scope, title: data.title, updatedAt: new Date() }
            : scope
        )
      );
      toast({
        title: "Success",
        description: "Scope updated successfully",
      });
    } else {
      // Add new scope
      const newScope: Scope = {
        id: (scopes.length + 1).toString(),
        title: data.title,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setScopes([...scopes, newScope]);
      toast({
        title: "Success",
        description: "Scope added successfully",
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (scopeToDelete) {
      setScopes(scopes.filter((scope) => scope.id !== scopeToDelete.id));
      toast({
        title: "Success",
        description: "Scope deleted successfully",
      });
      setIsDeleteModalOpen(false);
      setScopeToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scope Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage training scopes and categories
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-ps-primary hover:bg-ps-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      <Card className="p-6">
        <ScopeTable
          scopes={scopes}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </Card>

      <ScopeFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        scope={selectedScope}
        onSave={handleSave}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        scopeTitle={scopeToDelete?.title || ""}
      />
    </div>
  );
};
