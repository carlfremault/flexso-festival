import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Button, FlexBox, Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import { useAllEvents } from "@/features/events/adminQueries";
import { EventDeleteDialog } from "@/features/events/components/EventDeleteDialog";
import EventsTable from "@/features/events/components/EventsTable";
import type { PersistedAdminEvent } from "@/features/events/types";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";

export default function EventsOverviewAdmins() {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const navigate = useNavigate();
  const handleNewEventClick = () => navigate("/events/new");

  const { data: events } = useAllEvents();

  const handleSetDeleteTarget = (event: PersistedAdminEvent) => {
    setDeleteTarget({ id: event.ID, name: event.name });
  };

  const handleResetDeleteTarget = () => {
    setDeleteTarget(null);
  };

  const rowActions = useCallback(
    ({ row }: { row: PersistedAdminEvent }) => (
      <RowActions row={row} onDeleteClick={handleSetDeleteTarget} />
    ),
    [],
  );

  return (
    <PageWrapper
      title="Events Overview"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Emphasized" text="New Event" onClick={handleNewEventClick} />
        </Toolbar>
      }
    >
      <EventsTable events={events} rowActions={rowActions} />
      <EventDeleteDialog
        open={!!deleteTarget}
        deleteTarget={deleteTarget}
        onClose={handleResetDeleteTarget}
      />
    </PageWrapper>
  );
}

interface RowActionsProps {
  row: PersistedAdminEvent;
  onDeleteClick: (row: PersistedAdminEvent) => void;
}
function RowActions(props: RowActionsProps) {
  const { row, onDeleteClick } = props;

  const navigate = useNavigate();

  return (
    <FlexBox gap={12}>
      <Button
        onClick={() => navigate(`/events/${row.ID}`)}
        icon="edit"
        accessibleName={`Edit event ${row.name}`}
        accessibleRole="Link"
        design="Transparent"
        tooltip="Edit event name, dates and manage timeslots"
      />
      <Button
        onClick={() => onDeleteClick(row)}
        icon="delete"
        design="Transparent"
        accessibleName={`Delete event ${row.name}`}
        tooltip="Delete event"
      />
    </FlexBox>
  );
}
