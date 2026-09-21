import { Bar, Button, Dialog, FlexBox, MessageStrip, Text } from "@ui5/webcomponents-react";

import { useToast } from "@/components/layout/Toast";

import { useDeleteEvent } from "../adminQueries";

interface EventDeleteDialogProps {
  open: boolean;
  deleteTarget: { id: string; name: string } | null;
  onClose: () => void;
}

export function EventDeleteDialog(props: EventDeleteDialogProps) {
  const { open, deleteTarget, onClose } = props;

  const { showToast } = useToast();
  const { mutate: deleteEvent, isPending, error: deleteError, reset } = useDeleteEvent();

  const handleSuccess = () => {
    showToast("Event deleted!");
    onClose();
  };

  const handleDeleteEvent = () => {
    if (!deleteTarget) return;
    deleteEvent(deleteTarget.id, { onSuccess: handleSuccess });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      state="Negative"
      headerText="Delete Event"
      footer={
        <Bar
          design="Footer"
          endContent={
            <>
              <Button design="Negative" onClick={handleDeleteEvent} loading={isPending}>
                Delete
              </Button>
              <Button design="Transparent" onClick={handleClose}>
                Cancel
              </Button>
            </>
          }
        />
      }
    >
      <FlexBox direction="Column" gap={12}>
        {deleteError && (
          <MessageStrip role="alert" design="Negative" hideCloseButton>
            {deleteError.message}
          </MessageStrip>
        )}
        <Text>Are you sure you want to delete the event "{deleteTarget?.name}"?</Text>
      </FlexBox>
    </Dialog>
  );
}
