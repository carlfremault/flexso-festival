import { Grid } from "@ui5/webcomponents-react";

import type { ArtistCardArtist } from "../types";

import ArtistCard from "./ArtistCard";

interface ArtistGridProps<T extends ArtistCardArtist> {
  artists: T[];
  getRowKey: (artist: T) => string;
  renderAction?: (artist: T) => React.ReactElement;
}

export default function ArtistGrid<T extends ArtistCardArtist>(props: ArtistGridProps<T>) {
  const { artists, getRowKey, renderAction } = props;

  return (
    <Grid defaultIndent="XL0 L0 M0 S0" defaultSpan="XL4 L4 M12 S12" hSpacing="1rem" vSpacing="1rem">
      {artists.map((artist) => (
        <ArtistCard key={getRowKey(artist)} artist={artist} renderAction={renderAction} />
      ))}
    </Grid>
  );
}
