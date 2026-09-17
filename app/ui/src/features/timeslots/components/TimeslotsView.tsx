import { memo, Suspense } from "react";
import { Button, FlexBox, Panel, Title } from "@ui5/webcomponents-react";

import CenteredBusyIndicator from "../../../components/ui/CenteredBusyIndicator";

import TimeslotsTable from "./TimeslotsTable";

import "./TimeslotsView.css";

interface TimeslotsViewProps {
  eventId: string;
}

function TimeslotsView(props: TimeslotsViewProps) {
  const { eventId } = props;

  return (
    <Panel
      className="timeslots-panel"
      fixed
      header={
        <FlexBox alignItems="Center" fitContainer style={{ gap: "0.25rem" }}>
          <Title level="H2">Timeslots</Title>
          <span style={{ flexGrow: 1 }} />
          <Button design="Emphasized">New Timeslot</Button>
        </FlexBox>
      }
    >
      <Suspense fallback={<CenteredBusyIndicator />}>
        <TimeslotsTable eventId={eventId} />
      </Suspense>
    </Panel>
  );
}

export default memo(TimeslotsView);
