import type { Event as AdminEvent } from "#cds-models/AdminService";
import type { Event as UserEvent } from "#cds-models/UserService";

export type PersistedAdminEvent = AdminEvent & { ID: string; name: string };
export type PersistedUserEvent = UserEvent & { ID: string; name: string };
