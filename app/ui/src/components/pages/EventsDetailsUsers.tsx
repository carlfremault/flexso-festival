import { Navigate, useParams } from "react-router";
import { Panel, Title, Toolbar } from "@ui5/webcomponents-react";

import { useUserEvent } from "@/features/events/userQueries";
import TimeslotsTable from "@/features/timeslots/components/TimeslotsTable";
import { useAllUserTimeslots } from "@/features/timeslots/userQueries";

import PageWrapper from "../layout/PageWrapper";

export default function EventsDetailsUsers() {
  const params = useParams();
  if (!params.id) return <Navigate to="/events" replace />;
  return <EventDetailsView id={params.id} />;
}

function EventDetailsView({ id }: { id: string }) {
  const { data: event } = useUserEvent(id);
  const { data: timeslots } = useAllUserTimeslots(event.ID);

  return (
    <PageWrapper title={event.name} currentBreadcrumb={event.name} backTo="/events">
      <Panel
        className="timeslots-panel"
        fixed
        header={
          <Toolbar design="Transparent">
            <Title level="H2">Timeslots</Title>
          </Toolbar>
        }
      >
        <TimeslotsTable
          timeslots={timeslots}
          emptyTableSubTitle="Send us your artist suggestions!"
        />
      </Panel>
    </PageWrapper>
  );
}
