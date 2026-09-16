import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import type { Event, Events } from "#cds-models/AdminService";

import { parseODataError } from "../../utils/parseODataError";

// ----------------
// Fetch all events
// ----------------
const fetchAllEvents = async (): Promise<Events> => {
  const res = await fetch("/admin/Events?$expand=timeslots");
  if (!res.ok) {
    throw await parseODataError(res, `Failed to load events (${res.status})`);
  }
  const { value } = await res.json();
  return value;
};

const useAllEvents = (): UseSuspenseQueryResult<Events> => {
  return useSuspenseQuery({
    queryKey: ["events"],
    queryFn: fetchAllEvents,
  });
};

// ------------
// Create event
// ------------
const createEvent = async (body: Event): Promise<Event> => {
  const res = await fetch("/admin/Events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await parseODataError(res, `Failed to create event (${res.status})`);
  }

  return res.json();
};

const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: (created) => {
      queryClient.setQueryData<Events>(["events"], (old) => (old ? [...old, created] : [created]));
    },
  });
};

export { useAllEvents, useCreateEvent };
