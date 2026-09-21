import { useNavigate } from "react-router";
import { Grid, Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import ArtistCard from "@/features/artists/components/ArtistCard";
import { useAllUserArtists } from "@/features/artists/userQueries";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/delete.js";

export default function ArtistsOverviewUsers() {
  const navigate = useNavigate();
  const handleNewArtistsClick = () => navigate("/artists/new");

  const { data: artists } = useAllUserArtists();

  return (
    <PageWrapper
      title="Artist suggestions"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Emphasized" text="Add Artists" onClick={handleNewArtistsClick} />
        </Toolbar>
      }
    >
      <Grid
        defaultIndent="XL0 L0 M0 S0"
        defaultSpan="XL4 L4 M12 S12"
        hSpacing="1rem"
        vSpacing="1rem"
      >
        {artists.map((artist) => (
          <ArtistCard key={artist.ID} artist={artist} />
        ))}
      </Grid>
    </PageWrapper>
  );
}
