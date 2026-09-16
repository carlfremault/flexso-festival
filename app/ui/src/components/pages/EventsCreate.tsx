import { useNavigate } from "react-router";
import { Bar, Button } from "@ui5/webcomponents-react";

import EventForm from "../../features/events/components/EventForm";
import PageWrapper from "../layout/PageWrapper";

export default function EventsCreate() {
  const navigate = useNavigate();

  const handleCancelClick = () => navigate("/events");
  const handleSaveClick = () => console.log("save");

  return (
    <PageWrapper
      title="New Event"
      showFooter
      footerArea={
        <Bar
          design="Footer"
          endContent={
            <>
              <Button design="Transparent" onClick={() => navigate("/events")}>
                Cancel
              </Button>
              <Button design="Emphasized" type="Submit">
                Save
              </Button>
            </>
          }
        />
      }
    >
      <EventForm />
    </PageWrapper>
  );
}
