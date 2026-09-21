import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import { useAllArtists } from "@/features/artists/adminQueries";
import { ArtistDeleteDialog } from "@/features/artists/components/ArtistDeleteDialog";
import ArtistGrid from "@/features/artists/components/ArtistGrid";
import type { PersistedArtist } from "@/features/artists/types";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/delete.js";

export default function ArtistsOverviewAdmins() {
  const [deleteTarget, setDeleteTarget] = useState<PersistedArtist | null>(null);

  const navigate = useNavigate();
  const handleNewArtistsClick = () => navigate("/artists/new");

  const { data: artists } = useAllArtists();

  const getRowKey = (artist: PersistedArtist) => artist.ID;

  const handleSetDeleteTarget = (artist: PersistedArtist) => {
    setDeleteTarget(artist);
  };

  const handleResetDeleteTarget = () => {
    setDeleteTarget(null);
  };

  return (
    <PageWrapper
      title="Artist suggestions"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Emphasized" text="Add Artists" onClick={handleNewArtistsClick} />
        </Toolbar>
      }
    >
      <ArtistGrid
        artists={artists}
        getRowKey={getRowKey}
        renderAction={(artist) => (
          <Button
            icon="delete"
            design="Transparent"
            accessibleName={`Remove artist ${artist.name}`}
            onClick={() => handleSetDeleteTarget(artist)}
          />
        )}
      />
      <ArtistDeleteDialog
        open={!!deleteTarget}
        deleteTarget={deleteTarget}
        onClose={handleResetDeleteTarget}
      />
    </PageWrapper>
  );
}
