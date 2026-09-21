import { Fragment } from "react";
import { Avatar, Card, CardHeader, Text } from "@ui5/webcomponents-react";

import { formatDate } from "@/utils/dateTimeUtils";
import { formatNumber } from "@/utils/stringUtils";

import type { PersistedArtist } from "../types";

import { ArtistBookingTag } from "./ArtistBookingTag";

import "./ArtistCard.css";

interface ArtistCardProps {
  artist: PersistedArtist;
  renderAction?: (artist: PersistedArtist) => React.ReactElement;
}

export default function ArtistCard(props: ArtistCardProps) {
  const { artist, renderAction } = props;

  const rows = [
    ...(artist.bookings ?? []).map((b) => ({ ...b, status: "booked" as const })),
    ...(artist.requests ?? []).map((b) => ({ ...b, status: "requested" as const })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card
      className="artist-card"
      header={
        <CardHeader
          avatar={
            <Avatar shape="Square">
              {artist.imageUrl && <img alt={`${artist.name} picture`} src={artist.imageUrl} />}
            </Avatar>
          }
          titleText={artist.name}
          subtitleText={`${formatNumber(artist.nbFans)} fans`}
          action={renderAction?.(artist)}
        />
      }
    >
      <div className="artist-bookings">
        {rows.map((r) => (
          <Fragment key={r.ID}>
            <Text>{formatDate(r.date)}</Text>
            <Text>{r.event.name}</Text>
            <ArtistBookingTag status={r.status} />
          </Fragment>
        ))}
      </div>
    </Card>
  );
}
