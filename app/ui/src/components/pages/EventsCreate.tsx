import { useNavigate } from "react-router";
import { Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import EventForm from "../../features/events/components/EventForm";
import PageWrapper from "../layout/PageWrapper";

export default function EventsCreate() {
  const navigate = useNavigate();

  const handleCancelClick = () => navigate("/events");
  const handleSaveClick = () => console.log("save");

  return (
    <PageWrapper
      title="New Event"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Default" text="Cancel" onClick={handleCancelClick} />
          <ToolbarButton design="Emphasized" text="Save" onClick={handleSaveClick} />
        </Toolbar>
      }
    >
      <EventForm />
    </PageWrapper>
  );
}
