import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import type { Timeslot, Timeslots } from "#cds-models/AdminService";

import { parseODataError } from "../../utils/parseODataError";

import type { PersistedTimeslot } from "./types";

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
    onSuccess: (_created, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timeslots", variables.event_ID] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// ---------------
// Update timeslot
// ---------------
const updateTimeslot = async ({
  id,
  body,
}: {
  id: string;
  eventId: string;
  body: Partial<PersistedTimeslot>;
}): Promise<PersistedTimeslot> => {
  const res = await fetch(`/admin/Timeslots(${id})`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await parseODataError(res, `Failed to edit timeslot (${res.status})`);
  }

  return res.json();
};

const useUpdateTimeslot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeslot,
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timeslots", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// ---------------
// Delete timeslot
// ---------------
const deleteTimeslot = async ({ id }: { id: string; eventId: string }): Promise<void> => {
  const res = await fetch(`/admin/Timeslots(${id})`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw await parseODataError(res, `Failed to delete timeslot (${res.status})`);
  }
};

const useDeleteTimeslot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeslot,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timeslots", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export { useAllTimeslots, useCreateTimeslot, useUpdateTimeslot, useDeleteTimeslot };
