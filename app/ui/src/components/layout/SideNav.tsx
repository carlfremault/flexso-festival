import { useMatch, useNavigate } from "react-router";
import { SideNavigation, SideNavigationItem } from "@ui5/webcomponents-react";

import { createNavClickHandler, toHref } from "@/utils/routerUtils";

import { useUser } from "./UserProvider";

export default function SideNav() {
  const navigate = useNavigate();

  const { isAdmin } = useUser();

  const eventsMatch = useMatch("/events/*");
  const artistsMatch = useMatch("/artists/*");

  const handleEventsClick = createNavClickHandler(navigate, "/events");
  const handleArtistsClick = createNavClickHandler(navigate, "/artists");

  return (
    <SideNavigation slot="sideContent">
      <SideNavigationItem
        href={toHref("/events")}
        onClick={handleEventsClick}
        selected={!!eventsMatch}
        icon="business-suite/event"
        text="Events"
      />
      {isAdmin && (
        <SideNavigationItem
          href={toHref("/artists")}
          onClick={handleArtistsClick}
          selected={!!artistsMatch}
          icon="palette"
          text="Artists"
        />
      )}
    </SideNavigation>
  );
}
