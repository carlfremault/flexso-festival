import { useRef, useState } from "react";
import { usePrefetchQuery } from "@tanstack/react-query";
import {
  Bar,
  Button,
  Dialog,
  type DialogDomRef,
  type DialogPropTypes,
} from "@ui5/webcomponents-react";

import { artistsQueryOptions } from "../../artists/queries";

import TimeslotForm, { type TimeslotFormHandle } from "./TimeslotForm";

export default function TimeslotCreate() {
  // STATE
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  // HOOKS
  usePrefetchQuery(artistsQueryOptions);

  const dialogRef = useRef<DialogDomRef>(null);
  const formRef = useRef<TimeslotFormHandle>(null);

  // HANDLERS
  const handleStateChange = (isFormDisabled: boolean) => setIsFormDisabled(isFormDisabled);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleCloseEvent: NonNullable<DialogPropTypes["onClose"]> = (e) => {
    if (e.target !== dialogRef.current) return;
    handleCloseDialog();
  };

  return (
    <>
      <Dialog
        ref={dialogRef}
        open={isDialogOpen}
        headerText="New Timeslot"
        draggable
        style={{ width: "60vw" }}
        onClose={handleCloseEvent}
        footer={
          <Bar
            design="Footer"
            endContent={
              <>
                <Button design="Transparent" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  design="Emphasized"
                  onClick={() => formRef.current?.submit()}
                  disabled={isFormDisabled}
                >
                  Save
                </Button>
              </>
            }
          />
        }
      >
        {isDialogOpen && (
          <TimeslotForm
            ref={formRef}
            onClose={handleCloseDialog}
            onStateChange={handleStateChange}
          />
        )}
      </Dialog>
      <Button design="Emphasized" onClick={() => setIsDialogOpen(true)}>
        New Timeslot
      </Button>
    </>
  );
}
