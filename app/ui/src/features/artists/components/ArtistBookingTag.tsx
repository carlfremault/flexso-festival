import { Tag } from "@ui5/webcomponents-react";

import type { ArtistBookingStatus } from "#cds-models/index";

import { ARTIST_BOOKING_STATUS_CONFIG } from "../artistBookings";

export function ArtistBookingTag({ status }: { status: ArtistBookingStatus }) {
  const { label, design } = ARTIST_BOOKING_STATUS_CONFIG[status];

  return <Tag design={design}>{label}</Tag>;
}
