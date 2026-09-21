import { useState } from "react";
import { Button } from "@ui5/webcomponents-react";

import { useAllArtists } from "@/features/artists/adminQueries";
import { ArtistDeleteDialog } from "@/features/artists/components/ArtistDeleteDialog";
import ArtistOverview from "@/features/artists/components/ArtistOverview";
import type { PersistedArtist } from "@/features/artists/types";

import "@ui5/webcomponents-icons/dist/delete.js";

export default function ArtistsOverviewAdmins() {
  const [deleteTarget, setDeleteTarget] = useState<PersistedArtist | null>(null);

  const { data: artists } = useAllArtists();

  const handleSetDeleteTarget = (artist: PersistedArtist) => {
    setDeleteTarget(artist);
  };

  const handleResetDeleteTarget = () => {
    setDeleteTarget(null);
  };

  return (
    <ArtistOverview
      artists={artists}
      renderAction={(artist) => (
        <Button
          icon="delete"
          design="Transparent"
          accessibleName={`Remove artist ${artist.name}`}
          onClick={() => handleSetDeleteTarget(artist)}
        />
      )}
    >
      <ArtistDeleteDialog
        open={!!deleteTarget}
        deleteTarget={deleteTarget}
        onClose={handleResetDeleteTarget}
      />
    </ArtistOverview>
  );
}
