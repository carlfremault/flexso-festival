import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import type { Event } from "#cds-models/AdminService";

import { apiFetch, apiFetchWithMessages } from "@/utils/apiFetch";
import { type SapMessage } from "@/utils/parseSapMessages";

import type { PersistedAdminEvent } from "./types";

// ----------------
// Fetch all events
// ----------------
const fetchAllEvents = async (): Promise<PersistedAdminEvent[]> =>
  (
    await apiFetch<{ value: PersistedAdminEvent[] }>({
      service: "admin",
      path: `/Events?$expand=timeslots&$orderby=startDate`,
      errorMessage: "Failed to load events",
    })
  ).value;

const useAllEvents = (): UseSuspenseQueryResult<PersistedAdminEvent[]> => {
  return useSuspenseQuery({
    queryKey: ["admin", "events"],
    queryFn: fetchAllEvents,
  });
};

// ------------------
// Fetch single event
// ------------------
const fetchEvent = async (id: string): Promise<PersistedAdminEvent> =>
  apiFetch({
    service: "admin",
    path: `/Events/${id}?$expand=timeslots`,
    errorMessage: `Failed to load event ${id}`,
  });

const useEvent = (id: string): UseSuspenseQueryResult<PersistedAdminEvent> => {
  return useSuspenseQuery({
    queryKey: ["admin", "events", id],
    queryFn: () => fetchEvent(id),
  });
};

// ------------
// Create event
// ------------
const createEvent = async (body: Event): Promise<PersistedAdminEvent> =>
  apiFetch({
    service: "admin",
    path: "/Events",
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    errorMessage: "Failed to create event",
  });

const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
};

// ------------
// Update event
// ------------
type UpdateEventResult = { data: PersistedAdminEvent; messages: SapMessage[] };

const updateEvent = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<PersistedAdminEvent>;
}): Promise<UpdateEventResult> =>
  apiFetchWithMessages({
    service: "admin",
    path: `/Events/${id}`,
    init: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    errorMessage: `Failed to edit event ${id}`,
  });

const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateEvent"],
    mutationFn: updateEvent,
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "timeslots", variables.id] });
    },
  });
};

// -------------------------------
// Delete event
// -------------------------------
const deleteEvent = async (id: string): Promise<void> =>
  apiFetch({
    service: "admin",
    path: `/Events/${id}`,
    init: {
      method: "DELETE",
    },
    errorMessage: `Failed to delete event ${id}`,
  });

const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
};

export {
  useAllEvents,
  useEvent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  type UpdateEventResult,
};
