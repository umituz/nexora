import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CrudModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
}

export function CrudModal({
  open,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  variant = "default",
  loading = false,
}: CrudModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteConfirmModal({ open, onClose, onConfirm, itemName }: DeleteConfirmModalProps) {
  return (
    <CrudModal
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      onSubmit={onConfirm}
      submitLabel="Delete"
      variant="destructive"
    >
      <p className="text-sm text-muted-foreground">
        This will permanently remove this item and all associated data.
      </p>
    </CrudModal>
  );
}
