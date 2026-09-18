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
import type { TimeslotStatus } from "#cds-models/festival";

import { useEvent } from "@/features/events/queries";
import { useEventId } from "@/hooks/useEventId";
import { capitalize } from "@/utils/capitalize";
import { formatDate } from "@/utils/dateTimeUtils";

import { useAllTimeslots } from "../queries";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "./TimeslotsTable.css";

const STATUS_STATE: Record<TimeslotStatus, "Positive" | "Negative" | "Information"> = {
  confirmed: "Positive",
  requested: "Information",
  open: "Negative",
};

export default function TimeslotsTable() {
  const eventId = useEventId();
  const { data: event } = useEvent(eventId);
  const { data: timeslots } = useAllTimeslots(eventId);
  const showDate = event.startDate !== event.endDate;

  const columns = useMemo<AnalyticalTableColumnDefinition[]>(
    () => [
      { Header: "Name", accessor: "name", minWidth: 150 },
      ...(showDate
        ? [
            {
              Header: "Date",
              accessor: "date",
              Cell: ({ value }) => formatDate(value),
              minWidth: 100,
              hAlign: "Center",
            } as AnalyticalTableColumnDefinition,
          ]
        : []),
      { Header: "Start", accessor: "startTime", minWidth: 80, hAlign: "Center" },
      { Header: "End", accessor: "endTime", minWidth: 80, hAlign: "Center" },
      { Header: "Artist", accessor: "artist.name", minWidth: 150 },
      {
        Header: "Status",
        accessor: "status",
        minWidth: 100,
        Cell: ({ value }) => {
          const status = value as TimeslotStatus;
          return (
            <ObjectStatus className="timeslot-status" state={STATUS_STATE[status]} showDefaultIcon>
              {capitalize(status)}
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
    [showDate],
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
          subtitleText="Let's start planning!"
        />
      )}
    />
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
