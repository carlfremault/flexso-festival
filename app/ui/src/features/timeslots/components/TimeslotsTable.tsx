import { useMemo, useState } from "react";
import {
  AnalyticalTable,
  type AnalyticalTableColumnDefinition,
  AnalyticalTableScaleWidthMode,
  Button,
  FlexBox,
  Icon,
  IllustratedMessage,
} from "@ui5/webcomponents-react";

import { useEventId } from "@/hooks/useEventId";
import { formatDate } from "@/utils/dateTimeUtils";

import { useAllTimeslots } from "../adminQueries";
import type { PersistedTimeslot } from "../types";

import { TimeslotDeleteDialog } from "./TimeslotDeleteDialog";
import { TimeslotStatusBadge } from "./TimeslotStatusBadge";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/alert.js";

interface TimeslotsTableProps {
  onEdit: (timeslot: PersistedTimeslot) => void;
}

export default function TimeslotsTable(props: TimeslotsTableProps) {
  const { onEdit } = props;
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const eventId = useEventId();
  const { data: timeslots } = useAllTimeslots(eventId);

  const handleSetDeleteTarget = (timeslot: PersistedTimeslot) => {
    setDeleteTarget({ id: timeslot.ID, name: timeslot.name });
  };

  const handleResetDeleteTarget = () => {
    setDeleteTarget(null);
  };

  const columns = useMemo<AnalyticalTableColumnDefinition[]>(
    () => [
      { Header: "Name", accessor: "name", minWidth: 150 },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => formatDate(value),
        minWidth: 150,
        hAlign: "Center",
      } as AnalyticalTableColumnDefinition,
      { Header: "Start", accessor: "startTime", minWidth: 80, hAlign: "Center" },
      { Header: "End", accessor: "endTime", minWidth: 80, hAlign: "Center" },
      { Header: "Artist", accessor: "artist.name", minWidth: 150 },
      {
        Header: "Status",
        accessor: "status",
        minWidth: 150,
        Cell: ({ value, row }) => (
          <FlexBox alignItems="Center" justifyContent="Center" style={{ gap: "0.5rem" }}>
            <TimeslotStatusBadge status={value} />
            {row.original.needsRescheduling && (
              <Icon name="alert" design="Critical" accessibleName="Falls outside the event dates" />
            )}
          </FlexBox>
        ),
        hAlign: "Center",
      },
      {
        id: "actions",
        Header: "Actions",
        disableSortBy: true,
        minWidth: 100,
        Cell: ({ row }) => (
          <RowActions row={row.original} onEdit={onEdit} onDeleteClick={handleSetDeleteTarget} />
        ),
        hAlign: "Center",
      },
    ],
    [onEdit],
  );

  return (
    <>
      <AnalyticalTable
        columns={columns}
        data={timeslots}
        sortable
        filterable
        alternateRowColor
        scaleWidthMode={AnalyticalTableScaleWidthMode.Grow}
        accessibleName="Timeslots"
        NoDataComponent={() => (
          <IllustratedMessage
            design="Auto"
            titleText="No timeslots found :-("
            subtitleText="Let's start planning!"
          />
        )}
      />
      <TimeslotDeleteDialog
        open={!!deleteTarget}
        deleteTarget={deleteTarget}
        onClose={handleResetDeleteTarget}
        eventId={eventId}
      />
    </>
  );
}

interface RowActionsProps {
  row: PersistedTimeslot;
  onEdit: (row: PersistedTimeslot) => void;
  onDeleteClick: (row: PersistedTimeslot) => void;
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
