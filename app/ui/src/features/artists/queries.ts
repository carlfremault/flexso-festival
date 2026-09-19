import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import type { Artists } from "#cds-models/AdminService";

import { parseODataError } from "@/utils/parseODataError";

// -----------------
// Fetch all artists
// -----------------
const fetchAllArtists = async (): Promise<Artists> => {
  const res = await fetch("/admin/Artists?$orderby=name");
  if (!res.ok) {
    throw await parseODataError(res, `Failed to load artists (${res.status})`);
  }
  const { value } = await res.json();
  return value;
};

const artistsQueryOptions = queryOptions({
  queryKey: ["artists"],
  queryFn: fetchAllArtists,
});

const useAllArtists = () => useSuspenseQuery(artistsQueryOptions);

export { artistsQueryOptions, useAllArtists };
