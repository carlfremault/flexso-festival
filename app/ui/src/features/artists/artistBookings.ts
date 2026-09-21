import type { TagPropTypes } from "@ui5/webcomponents-react";

import type { ArtistBookingStatus } from "#cds-models/index";

type StatusMeta = { label: string; design: TagPropTypes["design"] };

export const ARTIST_BOOKING_STATUS_CONFIG: Record<ArtistBookingStatus, StatusMeta> = {
  available: {
    label: "Available",
    design: "Neutral",
  },
  requested: {
    label: "Requested",
    design: "Information",
  },
  booked: {
    label: "Confirmed",
    design: "Positive",
  },
};
