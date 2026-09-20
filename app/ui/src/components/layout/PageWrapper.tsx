import { useLocation, useNavigate } from "react-router";
import {
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  DynamicPage,
  DynamicPageTitle,
  FlexBox,
  Title,
} from "@ui5/webcomponents-react";

import { createNavClickHandler, toHref } from "@/utils/routerUtils";

import "@ui5/webcomponents-icons/dist/nav-back.js";

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  actionsBar?: React.ReactElement;
  currentBreadcrumb?: string;
  backTo?: string;
}

export default function PageWrapper(props: PageWrapperProps) {
  const { children, title, actionsBar, currentBreadcrumb, backTo } = props;

  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, idx, arr) => {
      const isCurrent = idx === arr.length - 1;
      return {
        label:
          isCurrent && currentBreadcrumb
            ? currentBreadcrumb
            : segment.charAt(0).toUpperCase() + segment.slice(1),
        path: "/" + arr.slice(0, idx + 1).join("/"),
        isCurrent,
      };
    });

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
          heading={
            <FlexBox alignItems="Center" gap={8}>
              {backTo && (
                <Button
                  design="Transparent"
                  icon="nav-back"
                  accessibleName="Back"
                  tooltip="Back"
                  onClick={() => navigate(backTo)}
                />
              )}
              <Title level="H1">{title}</Title>
            </FlexBox>
          }
        ></DynamicPageTitle>
      }
    >
      {children}
    </DynamicPage>
  );
}
