import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "@ui5/webcomponents-react";

import EventsTable from "@/features/events/components/EventsTable";
import type { PersistedUserEvent } from "@/features/events/types";
import { useAllUserEvents } from "@/features/events/userQueries";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/show.js";

export default function EventsOverviewUsers() {
  const { data: events } = useAllUserEvents();

  const rowActions = useCallback(
    ({ row }: { row: PersistedUserEvent }) => <RowActions row={row} />,
    [],
  );

  return (
    <PageWrapper title="Events Overview">
      <EventsTable events={events} rowActions={rowActions} />
    </PageWrapper>
  );
}

interface RowActionsProps {
  row: PersistedUserEvent;
}

function RowActions(props: RowActionsProps) {
  const { row } = props;

  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(`/events/${row.ID}`)}
      icon="show"
      accessibleName={`View event ${row.name}`}
      accessibleRole="Link"
      design="Transparent"
      tooltip="View event details"
    />
  );
}
