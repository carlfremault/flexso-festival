import { useMemo, useState } from "react";
import { Button, FlexBox, MessageStrip, Panel, Search, Tag } from "@ui5/webcomponents-react";

import ArtistGrid from "@/features/artists/components/ArtistGrid";
import type { SearchResultArtist } from "@/features/artists/types";
import {
  useAllUserArtists,
  useCreateArtist,
  useSearchedArtists,
} from "@/features/artists/userQueries";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import PageWrapper from "../layout/PageWrapper";
import { useToast } from "../layout/Toast";

import "@ui5/webcomponents-icons/dist/heart-2.js";

export default function ArtistsAdd() {
  const [searchString, setSearchString] = useState<string>("");

  const { data: persistedArtists } = useAllUserArtists();
  const { data: searchedArtists, error: searchError } = useSearchedArtists(
    useDebouncedValue(searchString),
  );

  const persistedByDeezerId = useMemo(
    () => new Map(persistedArtists.map((a) => [a.deezerId, a])),
    [persistedArtists],
  );

  const artists = useMemo(
    () =>
      searchedArtists?.map((artist) => {
        const persisted = persistedByDeezerId.get(artist.deezerId);
        return persisted ? { ...artist, ...persisted } : artist;
      }),
    [searchedArtists, persistedByDeezerId],
  );

  const {
    mutate: addArtist,
    error: addArtistError,
    reset,
    isPending,
    variables,
  } = useCreateArtist();

  const { showToast } = useToast();

  const handleAddArtist = (artist: SearchResultArtist) => {
    reset();

    const payload = {
      deezerId: artist.deezerId,
      name: artist.name,
      imageUrl: artist.imageUrl,
      nbFans: artist.nbFans,
    };

    addArtist(payload, {
      onSuccess: () => showToast("Suggestion added!"),
    });
  };

  const getRowKey = (artist: SearchResultArtist) => artist.deezerId.toString();

  const renderAction = (artist: SearchResultArtist) => {
    const alreadySuggested = persistedByDeezerId.get(artist.deezerId);

    if (alreadySuggested) {
      return <Tag design="Positive">Already suggested</Tag>;
    } else {
      return (
        <Button
          icon="heart-2"
          design="Transparent"
          accessibleName={`Add artist ${artist.name}`}
          onClick={() => handleAddArtist(artist)}
          disabled={isPending && variables?.deezerId === artist.deezerId}
          tooltip="Add artist to suggestion list"
        />
      );
    }
  };

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
        {(searchError ?? addArtistError) && (
          <MessageStrip design="Negative" role="alert" hideCloseButton>
            {(searchError ?? addArtistError)!.message}
          </MessageStrip>
        )}
        {artists && (
          <ArtistGrid artists={artists} getRowKey={getRowKey} renderAction={renderAction} />
        )}
      </FlexBox>
    </PageWrapper>
  );
}
