import ArtistOverview from "@/features/artists/components/ArtistOverview";
import { useAllUserArtists } from "@/features/artists/userQueries";

export default function ArtistsOverviewUsers() {
  const { data: artists } = useAllUserArtists();

  return <ArtistOverview artists={artists} />;
}
