import { ObjectStatus } from "@ui5/webcomponents-react";

import { isTimeslotStatus, TIMESLOT_STATUS_CONFIG } from "../timeslots";

import "./TimeslotStatusBadge.css";

export function TimeslotStatusBadge({ status }: { status: unknown }) {
  if (!isTimeslotStatus(status)) return null;
  const { label, state } = TIMESLOT_STATUS_CONFIG[status];
  return (
    <ObjectStatus className="timeslot-status" state={state} showDefaultIcon>
      {label}
    </ObjectStatus>
  );
}
