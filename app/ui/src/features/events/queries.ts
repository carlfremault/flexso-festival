import { useSuspenseQuery, type UseSuspenseQueryResult } from "@tanstack/react-query";

import type { Events } from "#cds-models/AdminService";

const fetchAllEvents = async (): Promise<Events> => {
  const res = await fetch("/admin/Events?$expand=timeslots");
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Failed to load events (${res.status})`);
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

export { useAllEvents };
