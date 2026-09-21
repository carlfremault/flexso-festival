import { useNavigate } from "react-router";
import { Button, Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import { useAllArtists } from "@/features/artists/adminQueries";
import ArtistGrid from "@/features/artists/components/ArtistGrid";
import type { PersistedArtist } from "@/features/artists/types";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/delete.js";

export default function ArtistsOverviewAdmins() {
  const navigate = useNavigate();
  const handleNewArtistsClick = () => navigate("/artists/new");

  const { data: artists } = useAllArtists();

  const getRowKey = (artist: PersistedArtist) => artist.ID;

  // TODO
  const handleRemoveArtist = (artistName: string) => {
    console.log("removing Artist", artistName);
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
            onClick={() => handleRemoveArtist(artist.ID)}
          />
        )}
      />
    </PageWrapper>
  );
}
