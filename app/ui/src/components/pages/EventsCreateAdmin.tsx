import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import EventForm, { type EventFormHandle } from "@/features/events/components/EventForm";

import PageWrapper from "../layout/PageWrapper";

export default function EventsCreateAdmin() {
  const navigate = useNavigate();
  const formRef = useRef<EventFormHandle>(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const handleStateChange = (isFormDisabled: boolean) => setIsFormDisabled(isFormDisabled);

  return (
    <PageWrapper
      title="New Event"
      backTo="/events"
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton
            design="Emphasized"
            text="Save"
            onClick={() => formRef.current?.submit()}
            disabled={isFormDisabled}
          />
          <ToolbarButton design="Default" text="Cancel" onClick={() => navigate("/events")} />
        </Toolbar>
      }
    >
      <EventForm ref={formRef} onStateChange={handleStateChange} />
    </PageWrapper>
  );
}
