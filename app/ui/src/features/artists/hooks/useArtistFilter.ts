import { useMemo, useState } from "react";

export function useArtistFilter<T extends { name: string }>(artists: T[]) {
  const [searchString, setSearchString] = useState<string>("");

  const filteredArtists = useMemo(
    () =>
      artists.filter((listItem) => {
        const name = listItem.name.toLowerCase();
        return name.includes(searchString.toLowerCase().trim());
      }),
    [artists, searchString],
  );

  return { searchString, setSearchString, filteredArtists };
}
