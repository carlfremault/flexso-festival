import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import type { Timeslot, Timeslots } from "#cds-models/AdminService";

import { parseODataError } from "../../utils/parseODataError";

// -----------------------------------------
// Fetch all timeslots belonging to an event
// -----------------------------------------
const fetchAllTimeslots = async (eventId: string): Promise<Timeslots> => {
  const res = await fetch(
    `/admin/Timeslots?$expand=artist&$filter=event_ID eq ${eventId}&$orderby=date,startTime`,
  );
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

// ---------------
// Create timeslot
// ---------------
const createTimeslot = async (body: Timeslot): Promise<Timeslot> => {
  const res = await fetch("/admin/Timeslots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await parseODataError(res, `Failed to create timeslot (${res.status})`);
  }

  return res.json();
};

const useCreateTimeslot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeslot,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["timeslots", created.event_ID] });
      queryClient.invalidateQueries({ queryKey: ["events", created.event_ID] });
    },
  });
};

export { useAllTimeslots, useCreateTimeslot };
