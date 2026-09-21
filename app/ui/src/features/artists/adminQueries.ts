import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { apiFetch } from "@/utils/apiFetch";

import type { PersistedArtist } from "./types";

// -----------------
// Fetch all artists
// -----------------
const fetchAllArtists = async (): Promise<PersistedArtist[]> =>
  (
    await apiFetch<{ value: PersistedArtist[] }>({
      service: "admin",
      path: "/Artists?$orderby=name&$expand=bookings($select=date;$expand=event($select=name)),requests($select=date;$expand=event($select=name))",
      errorMessage: "Failed to load artists",
    })
  ).value;

const artistsQueryOptions = queryOptions({
  queryKey: ["admin", "artists"],
  queryFn: fetchAllArtists,
});

const useAllArtists = () => useSuspenseQuery(artistsQueryOptions);

// -------------------------------
// Delete artist
// -------------------------------
const deleteArtist = async (id: string): Promise<void> =>
  apiFetch({
    service: "admin",
    path: `/Artists/${id}`,
    init: {
      method: "DELETE",
    },
    errorMessage: `Failed to remove artist ${id}`,
  });

const useDeleteArtist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "artists"] });
      queryClient.invalidateQueries({ queryKey: ["user", "artists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "timeslots"] });
    },
  });
};

export { artistsQueryOptions, useAllArtists, useDeleteArtist };
