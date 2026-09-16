import { useLocation, useNavigate } from "react-router";
import {
  Breadcrumbs,
  BreadcrumbsItem,
  DynamicPage,
  DynamicPageTitle,
  Title,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";

import EventsTable from "../../features/events/components/EventsTable";
import { createNavClickHandler, toHref } from "../../utils/routerUtils";

export default function Events() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, idx, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: "/" + arr.slice(0, idx + 1).join("/"),
      isCurrent: idx === arr.length - 1,
    }));

  return (
    <DynamicPage
      titleArea={
        <DynamicPageTitle
          actionsBar={
            <Toolbar design="Transparent">
              <ToolbarButton design="Emphasized" text="New Event" />
            </Toolbar>
          }
          breadcrumbs={
            <Breadcrumbs design="Standard" separators="Slash">
              {breadcrumbs.map((crumb) => (
                <BreadcrumbsItem
                  key={crumb.path}
                  href={crumb.isCurrent ? undefined : toHref(crumb.path)}
                  onClick={
                    crumb.isCurrent ? undefined : createNavClickHandler(navigate, crumb.path)
                  }
                >
                  {crumb.label}
                </BreadcrumbsItem>
              ))}
            </Breadcrumbs>
          }
          heading={<Title level="H1">Events Overview</Title>}
        ></DynamicPageTitle>
      }
    >
      <EventsTable />
    </DynamicPage>
  );
}
