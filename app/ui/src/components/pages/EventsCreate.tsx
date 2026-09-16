import { useRef } from "react";
import { useNavigate } from "react-router";
import { Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import EventForm, { type EventFormHandle } from "../../features/events/components/EventForm";
import PageWrapper from "../layout/PageWrapper";

export default function EventsCreate() {
  const navigate = useNavigate();
  const formRef = useRef<EventFormHandle>(null);

  return (
    <PageWrapper
      title="New Event"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Default" text="Cancel" onClick={() => navigate("/events")} />
          <ToolbarButton
            design="Emphasized"
            text="Save"
            onClick={() => formRef.current?.submit()}
            disabled={formRef.current?.isPending}
          />
        </Toolbar>
      }
    >
      <EventForm ref={formRef} onSuccess={() => navigate("/events")} />
    </PageWrapper>
  );
}
