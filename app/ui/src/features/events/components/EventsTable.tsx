import { useMemo } from "react";
import {
  AnalyticalTable,
  type AnalyticalTableColumnDefinition,
  AnalyticalTableScaleWidthMode,
  Button,
  FlexBox,
  IllustratedMessage,
} from "@ui5/webcomponents-react";

import type { Event } from "#cds-models/AdminService";

import { formatDateRange } from "../../../utils/dateUtils";
import { useAllEvents } from "../queries";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";

export default function EventsTable() {
  const { data: events } = useAllEvents();

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
        Cell: ({ row }) => <RowActions row={row.original} />,
        hAlign: "Center",
      },
    ],
    [],
  );

  return (
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
  );
}

function RowActions({ row }: { row: Event }) {
  return (
    <FlexBox gap={12}>
      <Button
        onClick={() => console.log(` navigating to /events/${row.ID}`)}
        icon="edit"
        accessibleName="Edit event"
        accessibleRole="Link"
        design="Transparent"
        tooltip="Edit event name, dates and manage timeslots"
      />
      <Button
        onClick={() => console.log(` deleting event with id ${row.ID}`)}
        icon="delete"
        design="Transparent"
        accessibleName="Delete event"
        tooltip="Delete event"
      />
    </FlexBox>
  );
}
