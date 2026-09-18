import { Bar, Button, Dialog, FlexBox, MessageStrip, Text } from "@ui5/webcomponents-react";

import { useDeleteEvent } from "../queries";

interface EventDeleteDialogProps {
  deleteTarget: { id: string; name: string };
  onClose: () => void;
}

export function EventDeleteDialog(props: EventDeleteDialogProps) {
  const { deleteTarget, onClose } = props;

  const { mutate: deleteEvent, isPending, error: deleteError } = useDeleteEvent();

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog
      open={!!deleteTarget}
      onClose={onClose}
      state="Negative"
      headerText="Delete Event"
      footer={
        <Bar
          design="Footer"
          endContent={
            <>
              <Button design="Transparent" onClick={() => onClose()} disabled={isPending}>
                Close
              </Button>
              <Button
                design="Negative"
                onClick={() => handleDeleteEvent(deleteTarget.id)}
                disabled={isPending}
              >
                Confirm
              </Button>
            </>
          }
        />
      }
    >
      <FlexBox direction="Column" gap={12}>
        {deleteError && (
          <MessageStrip design="Negative" hideCloseButton>
            {deleteError.message}
          </MessageStrip>
        )}
        <Text>
          Are you sure you want to delete the event "{deleteTarget.name}
          "?
        </Text>
      </FlexBox>
    </Dialog>
  );
}
