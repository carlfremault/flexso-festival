import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import type { Timeslot } from "#cds-models/AdminService";

import { apiFetch } from "@/utils/apiFetch";

import type { PersistedAdminTimeslot } from "./types";

// -----------------------------------------
// Fetch all timeslots belonging to an event
// -----------------------------------------
const fetchAllTimeslots = async (eventId: string): Promise<PersistedAdminTimeslot[]> =>
  (
    await apiFetch<{ value: PersistedAdminTimeslot[] }>({
      service: "admin",
      path: `/Timeslots?$expand=artist&$filter=event_ID eq ${eventId}&$orderby=date,startTime`,
      errorMessage: "Failed to load timeslots",
    })
  ).value;

const useAllTimeslots = (eventId: string): UseSuspenseQueryResult<PersistedAdminTimeslot[]> => {
  return useSuspenseQuery({
    queryKey: ["admin", "timeslots", eventId],
    queryFn: () => fetchAllTimeslots(eventId),
  });
};

// ---------------
// Create timeslot
// ---------------
const createTimeslot = async (body: Timeslot): Promise<PersistedAdminTimeslot> =>
  apiFetch({
    service: "admin",
    path: "/Timeslots",
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    errorMessage: "Failed to create timeslot",
  });

const useCreateTimeslot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeslot,
    onSuccess: (_created, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "timeslots", variables.event_ID] });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "artists"] });
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
  body: Partial<PersistedAdminTimeslot>;
}): Promise<PersistedAdminTimeslot> =>
  apiFetch({
    service: "admin",
    path: `/Timeslots/${id}`,
    init: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    errorMessage: `Failed to edit timeslot ${id}`,
  });

const useUpdateTimeslot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeslot,
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "timeslots", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "artists"] });
    },
  });
};

// ---------------
// Delete timeslot
// ---------------
const deleteTimeslot = async ({ id }: { id: string; eventId: string }): Promise<void> =>
  apiFetch({
    service: "admin",
    path: `/Timeslots/${id}`,
    init: {
      method: "DELETE",
    },
    errorMessage: `Failed to delete timeslot ${id}`,
  });

const useDeleteTimeslot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeslot,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "timeslots", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "artists"] });
    },
  });
};

export { useAllTimeslots, useCreateTimeslot, useUpdateTimeslot, useDeleteTimeslot };
