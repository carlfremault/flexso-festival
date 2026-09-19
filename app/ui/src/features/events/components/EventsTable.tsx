import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AnalyticalTable,
  type AnalyticalTableColumnDefinition,
  AnalyticalTableScaleWidthMode,
  Button,
  FlexBox,
  IllustratedMessage,
} from "@ui5/webcomponents-react";

import { formatDateRange } from "@/utils/dateTimeUtils";

import { useAllEvents } from "../adminQueries";
import type { PersistedUserEvent } from "../types";

import { EventDeleteDialog } from "./EventDeleteDialog";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";

export default function EventsTable() {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: events } = useAllEvents();

  const handleSetDeleteTarget = (event: PersistedUserEvent) => {
    setDeleteTarget({ id: event.ID, name: event.name });
  };

  const handleResetDeleteTarget = () => {
    setDeleteTarget(null);
  };

  const columns = useMemo<AnalyticalTableColumnDefinition[]>(
    () => [
      { Header: "Name", accessor: "name", minWidth: 150 },
      { Header: "Notes", accessor: "notes", minWidth: 150 },
      {
        Header: "Dates",
        accessor: (originalRow) => formatDateRange(originalRow.startDate, originalRow.endDate),
      },
      {
        Header: "Timeslots",
        accessor: (originalRow) => originalRow.timeslots?.length ?? 0,
        hAlign: "Center",
      },
      {
        id: "actions",
        Header: "Actions",
        disableSortBy: true,
        minWidth: 100,
        Cell: ({ row }) => <RowActions row={row.original} onDeleteClick={handleSetDeleteTarget} />,
        hAlign: "Center",
      },
    ],
    [],
  );

  return (
    <>
      <AnalyticalTable
        columns={columns}
        data={events}
        sortable
        filterable
        alternateRowColor
        scaleWidthMode={AnalyticalTableScaleWidthMode.Grow}
        accessibleName="Events"
        NoDataComponent={() => (
          <IllustratedMessage
            design="Auto"
            titleText="No events found :-("
            subtitleText="Let's start planning!"
          />
        )}
      />
      <EventDeleteDialog
        open={!!deleteTarget}
        deleteTarget={deleteTarget}
        onClose={handleResetDeleteTarget}
      />
    </>
  );
}

interface RowActionsProps {
  row: PersistedUserEvent;
  onDeleteClick: (row: PersistedUserEvent) => void;
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
