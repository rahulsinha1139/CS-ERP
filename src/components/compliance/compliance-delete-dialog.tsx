/**
 * Compliance Delete Confirmation Dialog
 * Confirm before deleting compliance item
 */

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AuraButton } from '../ui/aura-button';
import { AlertTriangle, X } from 'lucide-react';

interface ComplianceDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complianceName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function ComplianceDeleteDialog({
  open,
  onOpenChange,
  complianceName,
  onConfirm,
  isDeleting = false,
}: ComplianceDeleteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
                Delete Compliance Item
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-semibold">&quot;{complianceName}&quot;</span>?
                This action cannot be undone.
              </Dialog.Description>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> Deleting this compliance item will permanently remove all associated data, including activity history and alerts.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <AuraButton
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </AuraButton>
                <AuraButton
                  variant="primary"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Compliance'}
                </AuraButton>
              </div>
            </div>
            <Dialog.Close className="rounded-lg p-2 hover:bg-gray-100 transition-colors" disabled={isDeleting}>
              <X className="h-5 w-5 text-gray-500" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
