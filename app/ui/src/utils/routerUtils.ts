import type { NavigateFunction } from "react-router";

export const routerBasename = "/ui";

export function toHref(path: string): string {
  return `${routerBasename}${path}`;
}

type NavItemClickEvent = {
  detail: { altKey: boolean; ctrlKey: boolean; metaKey: boolean; shiftKey: boolean };
  preventDefault: () => void;
};

export function createNavClickHandler(navigate: NavigateFunction, to: string) {
  return (e: NavItemClickEvent) => {
    const { altKey, ctrlKey, metaKey, shiftKey } = e.detail;
    if (altKey || ctrlKey || metaKey || shiftKey) return;
    e.preventDefault();
    navigate(to);
  };
}
