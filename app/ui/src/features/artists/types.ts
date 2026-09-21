import type { Artist, Timeslot } from "#cds-models/AdminService";
import type { SearchedArtist } from "#cds-models/index";

type CdsDate = NonNullable<Timeslot["date"]>;

export type ArtistBooking = Timeslot & { ID: string; date: CdsDate; event: { name: string } };

export type PersistedArtist = Omit<Artist, "bookings" | "requests"> & {
  ID: string;
  name: string;
  bookings?: ArtistBooking[];
  requests?: ArtistBooking[];
};

export type SearchResultArtist = SearchedArtist & { deezerId: number; name: string };

export type ArtistCardArtist = {
  name: string;
  imageUrl?: string | null;
  nbFans?: number | null;
  bookings?: ArtistBooking[];
  requests?: ArtistBooking[];
};
