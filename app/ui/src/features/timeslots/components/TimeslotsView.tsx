import { memo, useCallback, useState } from "react";
import { Button, FlexBox, Panel, Title, Toolbar, ToolbarSpacer } from "@ui5/webcomponents-react";

import { useEventId } from "@/hooks/useEventId";

import { useAllTimeslots } from "../adminQueries";
import type { PersistedAdminTimeslot } from "../types";

import { TimeslotDeleteDialog } from "./TimeslotDeleteDialog";
import TimeslotFormDialog from "./TimeslotFormDialog";
import TimeslotsTable from "./TimeslotsTable";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "./TimeslotsView.css";

type DialogState =
  { mode: "create"; timeslot: null } | { mode: "edit"; timeslot: PersistedAdminTimeslot } | null;

function TimeslotsView() {
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const eventId = useEventId();
  const { data: timeslots } = useAllTimeslots(eventId);

  const handleEditTimeslot = useCallback((timeslot: PersistedAdminTimeslot) => {
    setDialogState({ mode: "edit", timeslot });
  }, []);

  const handleSetDeleteTarget = (timeslot: PersistedAdminTimeslot) => {
    setDeleteTarget({ id: timeslot.ID, name: timeslot.name });
  };

  const handleResetDeleteTarget = () => {
    setDeleteTarget(null);
  };

  const rowActions = useCallback(
    ({ row }: { row: PersistedAdminTimeslot }) => (
      <RowActions row={row} onEdit={handleEditTimeslot} onDeleteClick={handleSetDeleteTarget} />
    ),
    [],
  );

  return (
    <Panel
      className="timeslots-panel"
      fixed
      header={
        <Toolbar design="Transparent">
          <Title level="H2">Timeslots</Title>
          <ToolbarSpacer />
          <Button
            design="Emphasized"
            onClick={() => setDialogState({ mode: "create", timeslot: null })}
          >
            New Timeslot
          </Button>
        </Toolbar>
      }
    >
      <TimeslotsTable
        timeslots={timeslots}
        rowActions={rowActions}
        emptyTableSubTitle="Let's start planning!"
      />
      <TimeslotDeleteDialog
        open={!!deleteTarget}
        deleteTarget={deleteTarget}
        onClose={handleResetDeleteTarget}
        eventId={eventId}
      />
      <TimeslotFormDialog
        open={dialogState !== null}
        timeslot={dialogState?.timeslot ?? undefined}
        onClose={() => setDialogState(null)}
      />
    </Panel>
  );
}

interface RowActionsProps {
  row: PersistedAdminTimeslot;
  onEdit: (row: PersistedAdminTimeslot) => void;
  onDeleteClick: (row: PersistedAdminTimeslot) => void;
}

function RowActions(props: RowActionsProps) {
  const { row, onEdit, onDeleteClick } = props;

  return (
    <FlexBox gap={12}>
      <Button
        onClick={() => onEdit(row)}
        icon="edit"
        accessibleName={`Edit timeslot ${row.name}`}
        design="Transparent"
        tooltip="Edit timeslot name, time, artist and status"
      />
      <Button
        onClick={() => onDeleteClick(row)}
        icon="delete"
        design="Transparent"
        accessibleName={`Delete timeslot ${row.name}`}
        tooltip="Delete timeslot"
      />
    </FlexBox>
  );
}

export default memo(TimeslotsView);
