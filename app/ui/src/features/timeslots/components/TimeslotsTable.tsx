import { useMemo } from "react";
import {
  AnalyticalTable,
  type AnalyticalTableColumnDefinition,
  AnalyticalTableScaleWidthMode,
  FlexBox,
  Icon,
  IllustratedMessage,
} from "@ui5/webcomponents-react";
import type { CellInstance } from "@ui5/webcomponents-react/dist/components/AnalyticalTable/types/index.js";

import { formatDate } from "@/utils/dateTimeUtils";

import type { PersistedAdminTimeslot, PersistedUserTimeslot } from "../types";

import { TimeslotStatusBadge } from "./TimeslotStatusBadge";

import "@ui5/webcomponents-icons/dist/alert.js";

type RowActions<T> = ({ row }: { row: T }) => React.ReactNode;

interface TimeslotsTableProps {
  timeslots: PersistedAdminTimeslot[] | PersistedUserTimeslot[];
  emptyTableSubTitle: string;
  rowActions?: RowActions<PersistedAdminTimeslot | PersistedUserTimeslot>;
}

export default function TimeslotsTable(props: TimeslotsTableProps) {
  const { timeslots, emptyTableSubTitle, rowActions } = props;

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
      ...(rowActions
        ? ([
            {
              id: "actions",
              Header: "Actions",
              disableSortBy: true,
              minWidth: 100,
              Cell: (instance: CellInstance) => rowActions({ row: instance.row.original }),
              hAlign: "Center",
            },
          ] as AnalyticalTableColumnDefinition[])
        : []),
    ],
    [rowActions],
  );

  return (
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
          subtitleText={emptyTableSubTitle}
        />
      )}
    />
  );
}
