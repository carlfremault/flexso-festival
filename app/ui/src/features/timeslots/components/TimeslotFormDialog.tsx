import { Suspense, useRef, useState } from "react";
import { usePrefetchQuery } from "@tanstack/react-query";
import {
  Bar,
  Button,
  Dialog,
  type DialogDomRef,
  type DialogPropTypes,
} from "@ui5/webcomponents-react";

import CenteredBusyIndicator from "@/components/ui/CenteredBusyIndicator";
import { artistsQueryOptions } from "@/features/artists/adminQueries";

import type { PersistedAdminTimeslot } from "../types";

import TimeslotForm, { type TimeslotFormHandle } from "./TimeslotForm";

interface TimeslotFormDialogProps {
  open: boolean;
  onClose: () => void;
  timeslot?: PersistedAdminTimeslot;
}

export default function TimeslotFormDialog(props: TimeslotFormDialogProps) {
  const { open, onClose, timeslot } = props;

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  usePrefetchQuery(artistsQueryOptions);

  const dialogRef = useRef<DialogDomRef>(null);
  const formRef = useRef<TimeslotFormHandle>(null);

  const handleStateChange = (isFormDisabled: boolean) => setIsFormDisabled(isFormDisabled);
  const handleCloseEvent: NonNullable<DialogPropTypes["onClose"]> = (e) => {
    if (e.target !== dialogRef.current) return;
    onClose();
  };

  return (
    <Dialog
      ref={dialogRef}
      open={open}
      headerText={timeslot ? "Edit Timeslot" : "New Timeslot"}
      draggable
      style={{ width: "60vw" }}
      onClose={handleCloseEvent}
      footer={
        <Bar
          design="Footer"
          endContent={
            <>
              <Button
                design="Emphasized"
                onClick={() => formRef.current?.submit()}
                disabled={isFormDisabled}
              >
                Save
              </Button>
              <Button design="Transparent" onClick={onClose}>
                Cancel
              </Button>
            </>
          }
        />
      }
    >
      {open && (
        <Suspense fallback={<CenteredBusyIndicator />}>
          <TimeslotForm
            ref={formRef}
            onClose={onClose}
            onStateChange={handleStateChange}
            timeslot={timeslot}
          />
        </Suspense>
      )}
    </Dialog>
  );
}
