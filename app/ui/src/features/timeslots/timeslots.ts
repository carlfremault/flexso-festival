import type { ObjectStatusPropTypes } from "@ui5/webcomponents-react";

import type { TimeslotStatus } from "#cds-models/festival";

type ObjectStatusState = ObjectStatusPropTypes["state"];
type StatusMeta = { label: string; state: ObjectStatusState };

export const TIMESLOT_STATUS_CONFIG: Record<TimeslotStatus, StatusMeta> = {
  open: {
    label: "Open",
    state: "Negative",
  },
  requested: {
    label: "Requested",
    state: "Information",
  },
  confirmed: {
    label: "Confirmed",
    state: "Positive",
  },
};

export const TIMESLOT_STATUS_OPTIONS = Object.keys(TIMESLOT_STATUS_CONFIG) as TimeslotStatus[];

export function isTimeslotStatus(value: unknown): value is TimeslotStatus {
  return typeof value === "string" && value in TIMESLOT_STATUS_CONFIG;
}
