import cds from "@sap/cds";

type DeezerArtist = {
  id: number;
  name: string;
  picture_small?: string;
  nb_fan?: number;
};

type SearchArtistRequest = {
  data: { searchString: string };
};

type DeezerSearchResponse = {
  data?: DeezerArtist[];
  error?: { type: string; message: string; code: number };
};

export class DeezerConnection {
  deezer = cds.connect.to("deezer");

  async searchArtists({ data: { searchString } }: SearchArtistRequest) {
    let deezerResponse: DeezerSearchResponse;

    try {
      const deezerConnection = await this.deezer;
      deezerResponse = await deezerConnection.get(
        `/search/artist?q=${encodeURIComponent(searchString)}&limit=25`,
      );
    } catch (err) {
      throw new Error("Failed to connect to Deezer", { cause: err });
    }

    if (deezerResponse.error) {
      throw new Error(deezerResponse.error.message ?? "Failed to search artists");
    }

    if (!Array.isArray(deezerResponse.data)) {
      throw new Error("Unexpected response from Deezer");
    }

    return deezerResponse.data
      .map((artist: DeezerArtist) => ({
        deezerId: artist.id,
        name: artist.name,
        imageUrl: artist.picture_small,
        nbFans: artist.nb_fan ?? 0,
      }))
      .sort((a, b) => b.nbFans - a.nbFans);
  }
}
