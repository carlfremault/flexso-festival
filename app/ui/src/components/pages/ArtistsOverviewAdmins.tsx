import { useNavigate } from "react-router";
import { Button, Grid, Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import { useAllArtists } from "@/features/artists/adminQueries";
import ArtistCard from "@/features/artists/components/ArtistCard";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/delete.js";

export default function ArtistsOverviewAdmins() {
  const navigate = useNavigate();
  const handleNewArtistsClick = () => navigate("/artists/new");

  const { data: artists } = useAllArtists();

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
      <Grid
        defaultIndent="XL0 L0 M0 S0"
        defaultSpan="XL4 L4 M12 S12"
        hSpacing="1rem"
        vSpacing="1rem"
      >
        {artists.map((artist) => (
          <ArtistCard
            key={artist.ID}
            artist={artist}
            renderAction={(artist) => (
              <Button
                icon="delete"
                design="Transparent"
                accessibleName={`Remove artist ${artist.name}`}
                onClick={() => handleRemoveArtist(artist.ID)}
              />
            )}
          />
        ))}
      </Grid>
    </PageWrapper>
  );
}
