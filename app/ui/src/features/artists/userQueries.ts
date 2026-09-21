import { keepPreviousData, queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { apiFetch } from "@/utils/apiFetch";

import type { PersistedArtist, SearchResultArtist } from "./types";

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

// -------------------------
// Fetch artists from Deezer
// -------------------------
const fetchNewArtists = async (searchString: string): Promise<SearchResultArtist[]> =>
  (
    await apiFetch<{ value: SearchResultArtist[] }>({
      service: "user",
      path: `/searchArtists(searchString='${encodeURIComponent(searchString.replace(/'/g, "''"))}')`,
      errorMessage: "Failed to search artists",
    })
  ).value;

const useNewArtists = (searchString: string) =>
  useQuery({
    enabled: !!searchString && searchString.length >= 2,
    queryKey: ["user", "searchArtists", searchString],
    queryFn: () => fetchNewArtists(searchString),
    placeholderData: searchString ? keepPreviousData : undefined,
  });

export { artistsQueryOptions, useAllUserArtists, useNewArtists };
