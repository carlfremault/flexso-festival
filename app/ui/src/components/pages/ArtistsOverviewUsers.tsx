import { useNavigate } from "react-router";
import { Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import ArtistGrid from "@/features/artists/components/ArtistGrid";
import type { PersistedArtist } from "@/features/artists/types";
import { useAllUserArtists } from "@/features/artists/userQueries";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/delete.js";

export default function ArtistsOverviewUsers() {
  const navigate = useNavigate();
  const handleNewArtistsClick = () => navigate("/artists/new");

  const { data: artists } = useAllUserArtists();

  const getRowKey = (artist: PersistedArtist) => artist.ID;

  return (
    <PageWrapper
      title="Artist suggestions"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Emphasized" text="Add Artists" onClick={handleNewArtistsClick} />
        </Toolbar>
      }
    >
      <ArtistGrid artists={artists} getRowKey={getRowKey} />
    </PageWrapper>
  );
}
