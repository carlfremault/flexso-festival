import { Suspense, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import {
  Button,
  FlexBox,
  NavigationLayout,
  type NavigationLayoutDomRef,
} from "@ui5/webcomponents-react";
import { IllustratedMessage, MessageStrip } from "@ui5/webcomponents-react";

import CenteredBusyIndicator from "../ui/CenteredBusyIndicator";

import Header from "./Header";
import SideNav from "./SideNav";

import "@ui5/webcomponents-icons/dist/menu.js";
import "@ui5/webcomponents-icons/dist/palette.js";
import "@ui5/webcomponents-icons-business-suite/dist/event.js";

export default function Layout() {
  const navigationLayoutRef = useRef<NavigationLayoutDomRef>(null);
  const location = useLocation();

  return (
    <NavigationLayout
      ref={navigationLayoutRef}
      header={<Header ref={navigationLayoutRef} />}
      sideContent={<SideNav />}
    >
      <main>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              resetKeys={[location.pathname]}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <FlexBox
                  direction="Column"
                  justifyContent="Center"
                  alignItems="Center"
                  className="sap-padding"
                  gap={12}
                >
                  <IllustratedMessage name="UnableToLoad" titleText="Couldn't load this page" />
                  <MessageStrip design="Negative" hideCloseButton>
                    {error instanceof Error ? error.message : "Something went wrong"}
                  </MessageStrip>
                  <Button onClick={resetErrorBoundary}>Retry</Button>
                </FlexBox>
              )}
            >
              <Suspense fallback={<CenteredBusyIndicator />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </main>
    </NavigationLayout>
  );
}
