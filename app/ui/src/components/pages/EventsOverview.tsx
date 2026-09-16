import { useNavigate } from "react-router";
import { Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import EventsTable from "../../features/events/components/EventsTable";
import PageWrapper from "../layout/PageWrapper";

export default function EventsOverview() {
  const navigate = useNavigate();
  const handleNewEventClick = () => navigate("/events/new");

  return (
    <PageWrapper
      title="Events Overview"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Emphasized" text="New Event" onClick={handleNewEventClick} />
        </Toolbar>
      }
    >
      <EventsTable />
    </PageWrapper>
  );
}
