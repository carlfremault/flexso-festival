import { useSuspenseQuery, type UseSuspenseQueryResult } from "@tanstack/react-query";

import { apiFetch } from "@/utils/apiFetch";

import type { PersistedUserTimeslot } from "./types";

// -----------------------------------------
// Fetch all timeslots belonging to an event
// -----------------------------------------
const fetchAllUserTimeslots = async (eventId: string): Promise<PersistedUserTimeslot[]> =>
  (
    await apiFetch<{ value: PersistedUserTimeslot[] }>({
      service: "user",
      path: `/Timeslots?$expand=artist&$filter=event_ID eq ${eventId}&$orderby=date,startTime`,
      errorMessage: "Failed to load timeslots",
    })
  ).value;

const useAllUserTimeslots = (eventId: string): UseSuspenseQueryResult<PersistedUserTimeslot[]> => {
  return useSuspenseQuery({
    queryKey: ["user", "timeslots", eventId],
    queryFn: () => fetchAllUserTimeslots(eventId),
  });
};

export { useAllUserTimeslots };
