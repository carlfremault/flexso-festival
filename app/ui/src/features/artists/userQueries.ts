import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { apiFetch } from "@/utils/apiFetch";

import type { PersistedArtist } from "./types";

// -----------------
// Fetch all artists
// -----------------
const fetchAllUserArtists = async (): Promise<PersistedArtist[]> =>
  (
    await apiFetch<{ value: PersistedArtist[] }>({
      service: "user",
      path: "/Artists?$orderby=name&$expand=bookings($select=date;$expand=event($select=name)),requests($select=date;$expand=event($select=name))",
      errorMessage: "Failed to load artists",
    })
  ).value;

const artistsQueryOptions = queryOptions({
  queryKey: ["user", "artists"],
  queryFn: fetchAllUserArtists,
});

const useAllUserArtists = () => useSuspenseQuery(artistsQueryOptions);

export { artistsQueryOptions, useAllUserArtists };
