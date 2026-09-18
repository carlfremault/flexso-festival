import { useNavigate } from "react-router";
import { SideNavigation, SideNavigationItem } from "@ui5/webcomponents-react";

import { createNavClickHandler, toHref } from "@/utils/routerUtils";

export default function SideNav() {
  const navigate = useNavigate();

  const handleEventsClick = createNavClickHandler(navigate, "/events");
  const handleArtistsClick = createNavClickHandler(navigate, "/artists");

  return (
    <SideNavigation slot="sideContent">
      <SideNavigationItem
        href={toHref("/events")}
        onClick={handleEventsClick}
        icon="business-suite/event"
        text="Events"
      />
      <SideNavigationItem
        href={toHref("/artists")}
        onClick={handleArtistsClick}
        icon="palette"
        text="Artists"
      />
    </SideNavigation>
  );
}
