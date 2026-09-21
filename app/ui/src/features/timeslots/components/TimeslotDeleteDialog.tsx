import { Bar, Button, Dialog, FlexBox, MessageStrip, Text } from "@ui5/webcomponents-react";

import { useToast } from "@/components/layout/Toast";

import { useDeleteTimeslot } from "../adminQueries";

interface TimeslotDeleteDialogProps {
  open: boolean;
  deleteTarget: { id: string; name: string } | null;
  eventId: string;
  onClose: () => void;
}

export function TimeslotDeleteDialog(props: TimeslotDeleteDialogProps) {
  const { open, deleteTarget, eventId, onClose } = props;

  const { showToast } = useToast();
  const { mutate: deleteTimeslot, isPending, error: deleteError, reset } = useDeleteTimeslot();

  const handleSuccess = () => {
    showToast("Timeslot deleted!");
    onClose();
  };

  const handleDeleteTimeslot = () => {
    if (!deleteTarget) return;
    deleteTimeslot({ id: deleteTarget.id, eventId }, { onSuccess: handleSuccess });
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
      headerText="Delete Timeslot"
      footer={
        <Bar
          design="Footer"
          endContent={
            <>
              <Button design="Negative" onClick={handleDeleteTimeslot} loading={isPending}>
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
        <Text>Are you sure you want to delete the timeslot "{deleteTarget?.name}"?</Text>
      </FlexBox>
    </Dialog>
  );
}
