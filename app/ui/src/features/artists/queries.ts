import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import type { Artists } from "#cds-models/AdminService";

import { apiFetch } from "@/utils/apiFetch";

// -----------------
// Fetch all artists
// -----------------
const fetchAllArtists = async (): Promise<Artists> =>
  (
    await apiFetch<{ value: Artists }>({
      service: "admin",
      path: "/Artists?$orderby=name",
      errorMessage: "Failed to load artists",
    })
  ).value;

const artistsQueryOptions = queryOptions({
  queryKey: ["admin", "artists"],
  queryFn: fetchAllArtists,
});

const useAllArtists = () => useSuspenseQuery(artistsQueryOptions);

export { artistsQueryOptions, useAllArtists };
