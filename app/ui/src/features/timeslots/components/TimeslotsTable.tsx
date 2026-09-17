import { useMemo } from "react";
import {
  AnalyticalTable,
  type AnalyticalTableColumnDefinition,
  AnalyticalTableScaleWidthMode,
  Button,
  FlexBox,
  IllustratedMessage,
  ObjectStatus,
} from "@ui5/webcomponents-react";

import type { Timeslot } from "#cds-models/AdminService";

import { useAllTimeslots } from "../queries";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "./TimeslotsTable.css";

const STATUS_STATE: Record<
  NonNullable<Timeslot["status"]> | "null",
  "Positive" | "Negative" | "Information" | "None"
> = {
  confirmed: "Positive",
  requested: "Information",
  open: "Negative",
  null: "None",
};

interface TimeslotsTableProps {
  eventId: string;
}

export default function TimeslotsTable(props: TimeslotsTableProps) {
  const { eventId } = props;

  const { data: timeslots } = useAllTimeslots(eventId);

  const columns = useMemo<AnalyticalTableColumnDefinition[]>(
    () => [
      { Header: "Name", accessor: "name", minWidth: 150 },
      { Header: "Start", accessor: "startTime", minWidth: 100, hAlign: "Center" },
      { Header: "End", accessor: "endTime", minWidth: 100, hAlign: "Center" },
      { Header: "Artist", accessor: "artist.name", minWidth: 150 },
      {
        Header: "Status",
        accessor: "status",
        minWidth: 100,
        Cell: ({ value }) => {
          const status = value as Timeslot["status"];
          return (
            <ObjectStatus
              className="timeslot-status"
              state={STATUS_STATE[status ?? "null"]}
              showDefaultIcon
            >
              {status}
            </ObjectStatus>
          );
        },
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
    </>
  );
}

interface RowActionsProps {
  row: Timeslot;
}

function RowActions(props: RowActionsProps) {
  const { row } = props;

  return (
    <FlexBox gap={12}>
      <Button
        onClick={() => console.log(` editing timeslot with id ${row.ID}`)}
        icon="edit"
        accessibleName="Edit timeslot"
        design="Transparent"
        tooltip="Edit timeslot name, time, artist and status"
      />
      <Button
        onClick={() => console.log(` deleting timeslot with id ${row.ID}`)}
        icon="delete"
        design="Transparent"
        accessibleName="Delete timeslot"
        tooltip="Delete timeslot"
      />
    </FlexBox>
  );
}
