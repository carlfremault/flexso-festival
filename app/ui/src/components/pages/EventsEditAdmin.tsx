import { Suspense, useRef, useState } from "react";
import { Navigate, useParams } from "react-router";
import { FlexBox, Toolbar, ToolbarButton } from "@ui5/webcomponents-react";

import { useEvent } from "@/features/events/adminQueries";
import EventForm, { type EventFormHandle } from "@/features/events/components/EventForm";
import { TimeslotsRescheduleAlert } from "@/features/timeslots/components/TimeslotsRescheduleAlert";
import TimeslotsView from "@/features/timeslots/components/TimeslotsView";

import PageWrapper from "../layout/PageWrapper";
import CenteredBusyIndicator from "../ui/CenteredBusyIndicator";

export default function EventsEditAdmin() {
  const params = useParams();
  if (!params.id) return <Navigate to="/events" replace />;
  return <EventsEditView id={params.id} />;
}

function EventsEditView({ id }: { id: string }) {
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<EventFormHandle>(null);

  const { data: event } = useEvent(id);

  const handleStateChange = (isFormDisabled: boolean) => setIsFormDisabled(isFormDisabled);

  const handleCancelEdit = () => {
    formRef.current?.cancel();
    setIsEditing(false);
  };

  return (
    <PageWrapper
      title={event.name}
      currentBreadcrumb={event.name}
      backTo="/events"
      actionsBar={
        <Toolbar design="Transparent">
          {!isEditing && (
            <ToolbarButton design="Emphasized" text="Edit" onClick={() => setIsEditing(true)} />
          )}
          {isEditing && (
            <ToolbarButton
              design="Emphasized"
              text="Save"
              onClick={() => formRef.current?.submit()}
              disabled={isFormDisabled}
            />
          )}
          {isEditing && <ToolbarButton design="Default" text="Cancel" onClick={handleCancelEdit} />}
        </Toolbar>
      }
    >
      <FlexBox direction="Column" gap={16}>
        <EventForm
          ref={formRef}
          event={event}
          readonly={!isEditing}
          onStateChange={handleStateChange}
          onSaved={() => setIsEditing(false)}
        />
        <Suspense fallback={<CenteredBusyIndicator />}>
          <TimeslotsRescheduleAlert eventId={id} />
          <TimeslotsView />
        </Suspense>
      </FlexBox>
    </PageWrapper>
  );
}
