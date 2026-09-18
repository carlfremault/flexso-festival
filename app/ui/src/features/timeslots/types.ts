import type { Timeslot } from "#cds-models/AdminService";

export type PersistedTimeslot = Timeslot & { ID: string; event_ID: string };
