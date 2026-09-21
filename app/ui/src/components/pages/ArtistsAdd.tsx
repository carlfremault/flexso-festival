import { useState } from "react";
import { Button, FlexBox, MessageStrip, Panel, Search } from "@ui5/webcomponents-react";

import ArtistGrid from "@/features/artists/components/ArtistGrid";
import type { SearchResultArtist } from "@/features/artists/types";
import { useNewArtists } from "@/features/artists/userQueries";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import PageWrapper from "../layout/PageWrapper";

import "@ui5/webcomponents-icons/dist/heart-2.js";

export default function ArtistsAdd() {
  const [searchString, setSearchString] = useState<string>("");

  const { data: artists, isError } = useNewArtists(useDebouncedValue(searchString));

  // TODO
  const handleAddArtist = (artist: SearchResultArtist) => {
    console.log("adding Artist", artist.name);
  };

  const getRowKey = (artist: SearchResultArtist) => artist.deezerId.toString();

  return (
    <PageWrapper title="Suggest Artists" backTo="/artists">
      <FlexBox direction="Column" gap={12}>
        <Panel>
          <Search
            placeholder="Search for your favorite artists"
            onInput={(e) => setSearchString(e.target.value)}
            showClearIcon
          />
        </Panel>
        {isError && (
          <MessageStrip design="Negative" role="alert" hideCloseButton>
            Failed to load artists
          </MessageStrip>
        )}
        {artists && (
          <ArtistGrid
            artists={artists}
            getRowKey={getRowKey}
            renderAction={(artist) => (
              <Button
                icon="heart-2"
                design="Transparent"
                accessibleName={`Add artist ${artist.name}`}
                onClick={() => handleAddArtist(artist)}
              />
            )}
          />
        )}
      </FlexBox>
    </PageWrapper>
  );
}
