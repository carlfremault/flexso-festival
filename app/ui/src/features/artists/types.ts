import type { Artist, Timeslot } from "#cds-models/AdminService";

type CdsDate = NonNullable<Timeslot["date"]>;

export type ArtistBooking = Timeslot & { ID: string; date: CdsDate; event: { name: string } };

export type PersistedArtist = Omit<Artist, "bookings" | "requests"> & {
  ID: string;
  name: string;
  bookings?: ArtistBooking[];
  requests?: ArtistBooking[];
};
