import { useState } from "react";
import { createPortal } from "react-dom";
import NavigationLayoutMode from "@ui5/webcomponents-fiori/dist/types/NavigationLayoutMode.js";
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  type NavigationLayoutDomRef,
  ShellBar,
} from "@ui5/webcomponents-react";

import { useUser } from "./UserProvider";

import "@ui5/webcomponents-icons/dist/log.js";

interface HeaderProps {
  ref: React.RefObject<NavigationLayoutDomRef | null>;
}

export default function Header({ ref, ...props }: HeaderProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [menuOpener, setMenuOpener] = useState<HTMLElement>();

  const { givenName, familyName, id } = useUser();
  const userInitials =
    [givenName[0], familyName[0]]
      .filter(Boolean)
      .map((el) => el.toUpperCase())
      .join("") || id[0]?.toUpperCase();

  const toggleMode = () => {
    const el = ref?.current;
    if (!el) return;
    el.mode = el.isSideCollapsed() ? NavigationLayoutMode.Expanded : NavigationLayoutMode.Collapsed;
  };

  return (
    <>
      <ShellBar
        {...props}
        primaryTitle="Flexso Festival Manager"
        startButton={<Button icon="menu" onClick={toggleMode} accessibleName="Toggle navigation" />}
        profile={<Avatar initials={userInitials} />}
        onProfileClick={(e) => {
          setMenuOpener(e.detail.targetRef);
          setMenuIsOpen(true);
        }}
      />
      {createPortal(
        <Menu
          open={menuIsOpen}
          opener={menuOpener}
          horizontalAlign="End"
          onClose={() => setMenuIsOpen(false)}
        >
          <MenuItem icon="log" text="Logout" onClick={() => window.location.replace("/logout")} />
        </Menu>,
        document.body,
      )}
    </>
  );
}
