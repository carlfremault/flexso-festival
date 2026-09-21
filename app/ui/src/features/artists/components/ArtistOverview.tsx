import { useNavigate } from "react-router";
import {
  DynamicPageHeader,
  IllustratedMessage,
  Search,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";

import PageWrapper from "@/components/layout/PageWrapper";
import ArtistGrid from "@/features/artists/components/ArtistGrid";
import { useArtistFilter } from "@/features/artists/hooks/useArtistFilter";
import type { PersistedArtist } from "@/features/artists/types";

interface ArtistOverviewProps {
  artists: PersistedArtist[];
  renderAction?: (artist: PersistedArtist) => React.ReactElement;
  children?: React.ReactNode;
}

export default function ArtistOverview(props: ArtistOverviewProps) {
  const { artists, renderAction, children } = props;

  const navigate = useNavigate();
  const handleNewArtistsClick = () => navigate("/artists/new");

  const getRowKey = (artist: PersistedArtist) => artist.ID;

  const { searchString, setSearchString, filteredArtists } = useArtistFilter(artists);

  return (
    <PageWrapper
      title="Artist suggestions"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Emphasized" text="Add Artists" onClick={handleNewArtistsClick} />
        </Toolbar>
      }
      headerArea={
        <DynamicPageHeader>
          <Search
            placeholder="Search artists"
            onInput={(e) => setSearchString(e.target.value)}
            showClearIcon
          />
        </DynamicPageHeader>
      }
    >
      <ArtistGrid artists={filteredArtists} getRowKey={getRowKey} renderAction={renderAction} />
      {children}
      {searchString && filteredArtists.length == 0 && (
        <IllustratedMessage
          design="Auto"
          titleText="No artists found :-("
          subtitleText="Try a different search term"
        />
      )}
    </PageWrapper>
  );
}
