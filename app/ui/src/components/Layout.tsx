import { useRef } from "react";
import { Outlet, useHref, useNavigate } from "react-router";
import NavigationLayoutMode from "@ui5/webcomponents-fiori/dist/types/NavigationLayoutMode.js";
import {
  Button,
  NavigationLayout,
  type NavigationLayoutDomRef,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
} from "@ui5/webcomponents-react";

import "@ui5/webcomponents-icons/dist/menu.js";
import "@ui5/webcomponents-icons/dist/palette.js";
import "@ui5/webcomponents-icons-business-suite/dist/event.js";

function useNavItemClick(to: string) {
  const navigate = useNavigate();
  return (e: {
    detail: { altKey: boolean; ctrlKey: boolean; metaKey: boolean; shiftKey: boolean };
    preventDefault: () => void;
  }) => {
    const { altKey, ctrlKey, metaKey, shiftKey } = e.detail;
    if (altKey || ctrlKey || metaKey || shiftKey) return;
    e.preventDefault();
    navigate(to);
  };
}

export default function Layout() {
  const navigationLayoutRef = useRef<NavigationLayoutDomRef>(null);

  const toggleMode = () => {
    const el = navigationLayoutRef.current;
    if (!el) return;
    el.mode = el.isSideCollapsed() ? NavigationLayoutMode.Expanded : NavigationLayoutMode.Collapsed;
  };

  const handleEventsClick = useNavItemClick("/events");
  const handleArtistsClick = useNavItemClick("/artists");

  return (
    <NavigationLayout
      ref={navigationLayoutRef}
      header={
        <ShellBar
          primaryTitle="Flexso Festival Manager"
          startButton={
            <Button icon="menu" onClick={toggleMode} accessibleName="Toggle navigation" />
          }
        />
      }
      sideContent={
        <SideNavigation slot="sideContent">
          <SideNavigationItem
            href={useHref("/events")}
            onClick={handleEventsClick}
            icon="business-suite/event"
            text="Events"
          />
          <SideNavigationItem
            href={useHref("/artists")}
            onClick={handleArtistsClick}
            icon="palette"
            text="Artists"
          />
        </SideNavigation>
      }
    >
      <main
        style={{
          padding: "1rem",
        }}
      >
        <Outlet />
      </main>
    </NavigationLayout>
  );
}
