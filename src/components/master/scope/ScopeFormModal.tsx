import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scope } from "@/types/scope";

interface ScopeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: Scope | null;
  onSave: (data: { title: string }) => void;
}

export const ScopeFormModal = ({
  open,
  onOpenChange,
  scope,
  onSave,
}: ScopeFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ title: string }>({
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (scope) {
      reset({ title: scope.title });
    } else {
      reset({ title: "" });
    }
  }, [scope, reset]);

  const onSubmit = (data: { title: string }) => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {scope ? "Edit Scope" : "Add New Scope"}
          </DialogTitle>
          <DialogDescription>
            {scope
              ? "Update the scope details below"
              : "Enter the scope details below"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Scope Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter scope title"
              {...register("title", {
                required: "Scope title is required",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters",
                },
              })}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-ps-primary hover:bg-ps-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
