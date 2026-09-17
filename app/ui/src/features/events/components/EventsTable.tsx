import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AnalyticalTable,
  type AnalyticalTableColumnDefinition,
  AnalyticalTableScaleWidthMode,
  Bar,
  Button,
  Dialog,
  FlexBox,
  IllustratedMessage,
  MessageStrip,
  Text,
} from "@ui5/webcomponents-react";

import { formatDateRange } from "../../../utils/dateUtils";
import { useAllEvents, useDeleteEvent } from "../queries";
import type { PersistedEvent } from "../types";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";

export default function EventsTable() {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: events } = useAllEvents();
  const { mutate: deleteEvent, isPending, error: deleteError, reset } = useDeleteEvent();

  const handleSetDeleteTarget = (event: PersistedEvent) => {
    reset();
    setDeleteTarget({ id: event.ID, name: event.name });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id, {
      onSuccess: () => setDeleteTarget(null),
    });
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
      {deleteTarget && (
        <Dialog
          open={!!deleteTarget}
          state="Negative"
          headerText="Delete Event"
          footer={
            <Bar
              design="Footer"
              endContent={
                <>
                  <Button
                    design="Transparent"
                    onClick={() => {
                      reset();
                      setDeleteTarget(null);
                    }}
                    disabled={isPending}
                  >
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
      )}
    </>
  );
}

interface RowActionsProps {
  row: PersistedEvent;
  onDeleteClick: (row: PersistedEvent) => void;
}
function RowActions(props: RowActionsProps) {
  const { row, onDeleteClick } = props;

  const navigate = useNavigate();

  return (
    <FlexBox gap={12}>
      <Button
        onClick={() => navigate(`/events/${row.ID}`)}
        icon="edit"
        accessibleName="Edit event"
        accessibleRole="Link"
        design="Transparent"
        tooltip="Edit event name, dates and manage timeslots"
      />
      <Button
        onClick={() => onDeleteClick(row)}
        icon="delete"
        design="Transparent"
        accessibleName="Delete event"
        tooltip="Delete event"
      />
    </FlexBox>
  );
}
