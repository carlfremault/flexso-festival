import type { Event } from "#cds-models/AdminService";

export type PersistedEvent = Event & { ID: string; name: string };
