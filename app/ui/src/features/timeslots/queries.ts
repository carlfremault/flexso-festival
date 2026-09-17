import { useSuspenseQuery, type UseSuspenseQueryResult } from "@tanstack/react-query";

import type { Timeslots } from "#cds-models/AdminService";

import { parseODataError } from "../../utils/parseODataError";

// -----------------------------------------
// Fetch all timeslots belonging to an event
// -----------------------------------------
const fetchAllTimeslots = async (eventId: string): Promise<Timeslots> => {
  const res = await fetch(`/admin/Timeslots?$expand=artist&$filter=event_ID eq ${eventId}`);
  if (!res.ok) {
    throw await parseODataError(res, `Failed to load timeslots (${res.status})`);
  }
  const { value } = await res.json();
  return value;
};

const useAllTimeslots = (eventId: string): UseSuspenseQueryResult<Timeslots> => {
  return useSuspenseQuery({
    queryKey: ["timeslots", eventId],
    queryFn: () => fetchAllTimeslots(eventId),
  });
};

export { useAllTimeslots };
