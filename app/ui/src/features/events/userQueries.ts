import { useSuspenseQuery, type UseSuspenseQueryResult } from "@tanstack/react-query";

import { apiFetch } from "@/utils/apiFetch";

import type { PersistedUserEvent } from "./types";

// ----------------
// Fetch all events
// ----------------
const fetchAllUserEvents = async (): Promise<PersistedUserEvent[]> =>
  (
    await apiFetch<{ value: PersistedUserEvent[] }>({
      service: "user",
      path: `/Events?$expand=timeslots&$orderby=startDate`,
      errorMessage: "Failed to load events",
    })
  ).value;

const useAllUserEvents = (): UseSuspenseQueryResult<PersistedUserEvent[]> => {
  return useSuspenseQuery({
    queryKey: ["user", "events"],
    queryFn: fetchAllUserEvents,
  });
};

// ------------------
// Fetch single event
// ------------------
const fetchUserEvent = async (id: string): Promise<PersistedUserEvent> =>
  apiFetch({
    service: "user",
    path: `/Events/${id}?$expand=timeslots`,
    errorMessage: `Failed to load event ${id}`,
  });

const useUserEvent = (id: string): UseSuspenseQueryResult<PersistedUserEvent> => {
  return useSuspenseQuery({
    queryKey: ["user", "events", id],
    queryFn: () => fetchUserEvent(id),
  });
};

export { useAllUserEvents, useUserEvent };
