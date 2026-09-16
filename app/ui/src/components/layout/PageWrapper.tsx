import { useLocation, useNavigate } from "react-router";
import {
  Breadcrumbs,
  BreadcrumbsItem,
  DynamicPage,
  DynamicPageTitle,
  Title,
} from "@ui5/webcomponents-react";

import { createNavClickHandler, toHref } from "../../utils/routerUtils";

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  actionsBar?: React.ReactElement;
}

export default function PageWrapper(props: PageWrapperProps) {
  const { children, title, actionsBar } = props;

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
          actionsBar={actionsBar}
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
          heading={<Title level="H1">{title}</Title>}
        ></DynamicPageTitle>
      }
    >
      {children}
    </DynamicPage>
  );
}
