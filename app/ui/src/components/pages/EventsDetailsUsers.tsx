import { Navigate, useNavigate, useParams } from "react-router";
import { Panel, Title, Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

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
  const navigate = useNavigate();

  const { data: event } = useUserEvent(id);
  const { data: timeslots } = useAllUserTimeslots(event.ID);

  return (
    <PageWrapper
      title="Event details"
      currentBreadcrumb={event.name}
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Default" text="Back" onClick={() => navigate("/events")} />
        </Toolbar>
      }
    >
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
