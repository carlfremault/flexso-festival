import { memo, Suspense } from "react";
import { FlexBox, Panel, Title } from "@ui5/webcomponents-react";

import CenteredBusyIndicator from "../../../components/ui/CenteredBusyIndicator";

import TimeslotCreate from "./TimeslotCreate";
import TimeslotsTable from "./TimeslotsTable";

import "./TimeslotsView.css";

function TimeslotsView() {
  return (
    <Panel
      className="timeslots-panel"
      fixed
      header={
        <FlexBox alignItems="Center" fitContainer style={{ gap: "0.25rem" }}>
          <Title level="H2">Timeslots</Title>
          <span style={{ flexGrow: 1 }} />
          <TimeslotCreate />
        </FlexBox>
      }
    >
      <Suspense fallback={<CenteredBusyIndicator />}>
        <TimeslotsTable />
      </Suspense>
    </Panel>
  );
}

export default memo(TimeslotsView);
