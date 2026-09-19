import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import type { Event, Events } from "#cds-models/AdminService";

import { parseSapMessages, type SapMessage } from "@/utils/parseSapMessages";

import { parseODataError } from "../../utils/parseODataError";

import type { PersistedEvent } from "./types";

// ----------------
// Fetch all events
// ----------------
const fetchAllEvents = async (): Promise<Events> => {
  const res = await fetch("/admin/Events?$expand=timeslots&$orderby=startDate");
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

// ------------------
// Fetch single event
// ------------------
const fetchEvent = async (id: string): Promise<PersistedEvent> => {
  const res = await fetch(`/admin/Events/${id}?$expand=timeslots`);
  if (!res.ok) {
    throw await parseODataError(res, `Failed to load events (${res.status})`);
  }

  return res.json();
};

const useEvent = (id: string): UseSuspenseQueryResult<PersistedEvent> => {
  return useSuspenseQuery({
    queryKey: ["events", id],
    queryFn: () => fetchEvent(id),
  });
};

// ------------
// Create event
// ------------
const createEvent = async (body: Event): Promise<PersistedEvent> => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// ------------
// Update event
// ------------

type UpdateEventResult = { data: PersistedEvent; messages: SapMessage[] };

const updateEvent = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<PersistedEvent>;
}): Promise<UpdateEventResult> => {
  const res = await fetch(`/admin/Events(${id})`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await parseODataError(res, `Failed to edit event (${res.status})`);
  }

  return { data: await res.json(), messages: parseSapMessages(res) };
};

const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateEvent"],
    mutationFn: updateEvent,
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["timeslots", variables.id] });
    },
  });
};

// -------------------------------
// Delete event
// -------------------------------
const deleteEvent = async (id: string): Promise<void> => {
  const res = await fetch(`/admin/Events(${id})`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw await parseODataError(res, `Failed to delete event (${res.status})`);
  }
};

const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
