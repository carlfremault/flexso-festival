import { Bar, Button, Dialog, FlexBox, MessageStrip, Text } from "@ui5/webcomponents-react";

import { useToast } from "@/components/layout/Toast";

import { useDeleteArtist } from "../adminQueries";
import type { PersistedArtist } from "../types";

interface ArtistDeleteDialogProps {
  open: boolean;
  deleteTarget: PersistedArtist | null;
  onClose: () => void;
}

export function ArtistDeleteDialog(props: ArtistDeleteDialogProps) {
  const { open, deleteTarget, onClose } = props;

  const { showToast } = useToast();
  const { mutate: deleteArtist, isPending, error: deleteError, reset } = useDeleteArtist();

  const handleSuccess = () => {
    showToast("Artist removed!");
    onClose();
  };

  const handleDeleteArtist = () => {
    if (!deleteTarget) return;
    deleteArtist(deleteTarget.ID, { onSuccess: handleSuccess });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const artistsRequests = deleteTarget?.requests?.length || "";
  const artistsBookings = deleteTarget?.bookings?.length || "";

  const artistsBookingsMsg =
    artistsBookings &&
    `${artistsBookings} confirmed ${artistsBookings > 1 ? "timeslots" : "timeslot"}`;
  const artistRequestsMsg =
    artistsRequests &&
    `${artistsRequests} requested ${artistsRequests > 1 ? "timeslots" : "timeslot"}`;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      state="Negative"
      headerText="Remove Artist"
      footer={
        <Bar
          design="Footer"
          endContent={
            <>
              <Button design="Negative" onClick={handleDeleteArtist} loading={isPending}>
                Remove
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
        <Text>Are you sure you want to remove "{deleteTarget?.name}"?</Text>
        {(artistRequestsMsg || artistsBookingsMsg) && (
          <MessageStrip design="Critical" hideCloseButton>
            {`Removing this artist will set ${[artistsBookingsMsg, artistRequestsMsg].filter(Boolean).join(" and ")} back to Open.`}
          </MessageStrip>
        )}
      </FlexBox>
    </Dialog>
  );
}
