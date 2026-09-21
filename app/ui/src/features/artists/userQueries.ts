import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import type { Artist } from "#cds-models/UserService";

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
const fetchSearchedArtists = async (searchString: string): Promise<SearchResultArtist[]> =>
  (
    await apiFetch<{ value: SearchResultArtist[] }>({
      service: "user",
      path: `/searchArtists(searchString='${encodeURIComponent(searchString.replace(/'/g, "''"))}')`,
      errorMessage: "Failed to search artists",
    })
  ).value;

const useSearchedArtists = (searchString: string) =>
  useQuery({
    enabled: !!searchString && searchString.length >= 2,
    queryKey: ["user", "searchArtists", searchString],
    queryFn: () => fetchSearchedArtists(searchString),
    placeholderData: searchString ? keepPreviousData : undefined,
  });

// -------------
// Create artist
// -------------
const createArtist = async (body: Artist): Promise<SearchResultArtist> =>
  apiFetch({
    service: "user",
    path: "/Artists",
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    errorMessage: "Failed to create artist",
  });

const useCreateArtist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "artists"] });
      queryClient.invalidateQueries({ queryKey: ["user", "artists"] });
    },
  });
};

export { artistsQueryOptions, useAllUserArtists, useSearchedArtists, useCreateArtist };
