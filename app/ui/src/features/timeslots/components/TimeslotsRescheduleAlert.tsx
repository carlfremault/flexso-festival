import { useMutationState } from "@tanstack/react-query";
import { MessageStrip } from "@ui5/webcomponents-react";

import type { UpdateEventResult } from "@/features/events/adminQueries";

import { useAllTimeslots } from "../adminQueries";

export function TimeslotsRescheduleAlert({ eventId }: { eventId: string }) {
  const { data: timeslots } = useAllTimeslots(eventId);
  const count = timeslots.filter((t) => t.needsRescheduling).length;

  const serverMessages = useMutationState({
    filters: { mutationKey: ["updateEvent"], status: "success" },
    select: (mutation) => (mutation.state.data as UpdateEventResult | undefined)?.messages,
  });

  if (!count) return null;

  const message =
    serverMessages.at(-1)?.[0]?.message ??
    "Some timeslots fall outside the event dates and need rescheduling";

  return (
    <MessageStrip design="Critical" hideCloseButton>
      {message}
    </MessageStrip>
  );
}
