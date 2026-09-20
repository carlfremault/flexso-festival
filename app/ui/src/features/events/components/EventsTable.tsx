import { useMemo } from "react";
import {
  AnalyticalTable,
  type AnalyticalTableColumnDefinition,
  AnalyticalTableScaleWidthMode,
  IllustratedMessage,
} from "@ui5/webcomponents-react";
import type { CellInstance } from "@ui5/webcomponents-react/dist/components/AnalyticalTable/types/index.js";

import { formatDateRange } from "@/utils/dateTimeUtils";

import type { PersistedAdminEvent, PersistedUserEvent } from "../types";

type RowActions<T> = ({ row }: { row: T }) => React.ReactNode;

interface EventsTableProps {
  events: PersistedAdminEvent[] | PersistedUserEvent[];
  rowActions: RowActions<PersistedAdminEvent | PersistedUserEvent>;
}
export default function EventsTable(props: EventsTableProps) {
  const { events, rowActions } = props;

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
        Cell: (instance: CellInstance) => rowActions({ row: instance.row.original }),
        hAlign: "Center",
      },
    ],
    [rowActions],
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
