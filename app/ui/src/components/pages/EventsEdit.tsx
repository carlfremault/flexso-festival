import { useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import EventForm, { type EventFormHandle } from "../../features/events/components/EventForm";
import { useEvent } from "../../features/events/queries";
import PageWrapper from "../layout/PageWrapper";

export default function EventsEdit() {
  const params = useParams();
  if (!params.id) return <Navigate to="/events" replace />;
  return <EventsEditView id={params.id} />;
}

function EventsEditView({ id }: { id: string }) {
  const navigate = useNavigate();
  const formRef = useRef<EventFormHandle>(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const { data: event } = useEvent(id);

  const handleStateChange = (isFormDisabled: boolean) => setIsFormDisabled(isFormDisabled);

  return (
    <PageWrapper
      title="Edit Event"
      currentBreadcrumb={event.name}
      actionsBar={
        <Toolbar design="Transparent">
          <ToolbarButton design="Default" text="Cancel" onClick={() => navigate("/events")} />
          <ToolbarButton
            design="Emphasized"
            text="Save"
            onClick={() => formRef.current?.submit()}
            disabled={isFormDisabled}
          />
        </Toolbar>
      }
    >
      <EventForm
        ref={formRef}
        onSuccess={() => navigate("/events")}
        event={event}
        onStateChange={handleStateChange}
      />
      {/* TODO */}
      <p>Timeslots here</p>
    </PageWrapper>
  );
}
