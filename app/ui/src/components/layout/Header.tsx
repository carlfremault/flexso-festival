import NavigationLayoutMode from "@ui5/webcomponents-fiori/dist/types/NavigationLayoutMode.js";
import { Button, type NavigationLayoutDomRef, ShellBar } from "@ui5/webcomponents-react";

interface HeaderProps {
  ref: React.RefObject<NavigationLayoutDomRef | null>;
}

export default function Header({ ref, ...props }: HeaderProps) {
  const toggleMode = () => {
    const el = ref?.current;
    if (!el) return;
    el.mode = el.isSideCollapsed() ? NavigationLayoutMode.Expanded : NavigationLayoutMode.Collapsed;
  };

  return (
    <ShellBar
      {...props}
      primaryTitle="Flexso Festival Manager"
      startButton={<Button icon="menu" onClick={toggleMode} accessibleName="Toggle navigation" />}
    />
  );
}
