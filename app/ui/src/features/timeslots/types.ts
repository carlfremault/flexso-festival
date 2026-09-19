import type { Timeslot as AdminTimeslot } from "#cds-models/AdminService";
import type { Timeslot as UserTimeslot } from "#cds-models/UserService";

export type PersistedAdminTimeslot = AdminTimeslot & { ID: string; event_ID: string; name: string };
export type PersistedUserTimeslot = UserTimeslot & { ID: string; event_ID: string; name: string };
