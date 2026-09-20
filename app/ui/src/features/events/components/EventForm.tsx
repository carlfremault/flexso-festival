import { useEffect, useImperativeHandle } from "react";
import { useNavigate } from "react-router";
import type { CalendarSelectionChangeEventDetail } from "@ui5/webcomponents/dist/Calendar.js";
import {
  Calendar,
  CalendarDateRange,
  DatePicker,
  Form,
  FormGroup,
  FormItem,
  Input,
  Label,
  MessageStrip,
  TextArea,
} from "@ui5/webcomponents-react";

import type { Event } from "#cds-models/AdminService";

import { useToast } from "@/components/layout/Toast";
import FormField from "@/components/ui/FormField";
import { useFormState } from "@/hooks/useFormState";
import { type CdsDate, isCdsDate } from "@/utils/dateTimeUtils";

import { useCreateEvent, useUpdateEvent } from "../adminQueries";
import type { PersistedAdminEvent } from "../types";

import "./EventForm.css";

export interface EventFormHandle {
  submit: () => void;
  cancel: () => void;
}

function getInitialValues(event?: Event) {
  return {
    name: event?.name ?? "",
    notes: event?.notes ?? "",
    startDate: event?.startDate ?? "",
    endDate: event?.endDate ?? "",
  };
}

type EventFieldErrors = Partial<Record<keyof ReturnType<typeof getInitialValues>, string>>;
const EVENT_FORM_FIELDS = Object.keys(getInitialValues()) as (keyof EventFieldErrors)[];

interface EventFormProps {
  ref: React.Ref<EventFormHandle>;
  onStateChange: (isFormDisabled: boolean) => void;
  event?: PersistedAdminEvent;
  readonly?: boolean;
  onSaved?: () => void;
}

export default function EventForm(props: EventFormProps) {
  const { ref, onStateChange, event, readonly = false, onSaved } = props;
  const editMode = !!event;

  // HOOKS
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const isPending = isCreating || isUpdating;

  const {
    formValues,
    fieldErrors,
    setFieldErrors,
    formError,
    handleFieldChange,
    handleError,
    handleErrorReset,
    handleFormReset,
    isDirty,
  } = useFormState(getInitialValues(event), EVENT_FORM_FIELDS);

  useEffect(() => {
    const isFormDisabled = !isDirty || isPending;
    onStateChange(isFormDisabled);
  }, [isDirty, isPending]);

  // HANDLERS
  const handleChangeDateRange = (e: CustomEvent<CalendarSelectionChangeEventDetail>) => {
    e.preventDefault();
    if (readonly) return;
    handleFieldChange("startDate", e.detail.selectedValues[0]);
    handleFieldChange("endDate", e.detail.selectedValues[1]);
  };

  const handleEditSuccess = () => {
    showToast("Event updated!");
    handleErrorReset();
    onSaved?.();
  };

  const handleCreateSuccess = (created: PersistedAdminEvent) => {
    showToast("Event created!");
    handleErrorReset();
    navigate(`/events/${created.ID}`, { replace: true });
  };

  const handleSubmit = () => {
    const trimmedName = formValues.name.trim();
    handleFieldChange("name", trimmedName);
    const errors: Partial<EventFieldErrors> = {};

    if (!trimmedName) errors.name = "Name is required";
    if (!isCdsDate(formValues.startDate)) errors.startDate = "Start date is required";
    if (!isCdsDate(formValues.endDate)) errors.endDate = "End date is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      name: trimmedName,
      notes: formValues.notes,
      startDate: formValues.startDate as CdsDate,
      endDate: formValues.endDate as CdsDate,
    };

    if (editMode) {
      updateEvent(
        { id: event.ID, body: payload },
        { onSuccess: handleEditSuccess, onError: handleError },
      );
    } else {
      createEvent(payload, { onSuccess: handleCreateSuccess, onError: handleError });
    }
  };

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(),
    cancel: () => handleFormReset(getInitialValues(event)),
  }));

  return (
    <>
      {formError && (
        <MessageStrip design="Negative" role="alert" hideCloseButton>
          {formError}
        </MessageStrip>
      )}
      <Form
        className="event-form"
        headerText="Event details"
        labelSpan="S12 M12 L12 XL12"
        layout="S1 M2 L3 XL3"
      >
        <FormGroup colSpan="S1 M1 L1 XL1">
          <FormItem className="calendar-form-item">
            <Calendar
              aria-label="Event dates"
              onSelectionChange={(e) => handleChangeDateRange(e)}
              primaryCalendarType="Gregorian"
              selectionMode="Range"
              valueFormat="yyyy-MM-dd"
            >
              <CalendarDateRange startValue={formValues.startDate} endValue={formValues.endDate} />
            </Calendar>
          </FormItem>
        </FormGroup>
        <FormGroup colSpan="S1 M1 L2 XL2">
          <FormField required label="Name" error={fieldErrors.name} errorId="name-error">
            <Input
              type="Text"
              required
              readonly={readonly}
              value={formValues.name}
              onInput={(e) => handleFieldChange("name", e.target.value)}
              valueState={fieldErrors.name ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.name}</span>}
              accessibleDescriptionRef={fieldErrors.name ? "name-error" : undefined}
              style={{ width: "100%" }}
            />
          </FormField>
          <FormField
            required
            label="From"
            error={fieldErrors.startDate}
            errorId="startDate-error"
            className="date-range-item"
          >
            <DatePicker
              readonly
              required
              value={formValues.startDate}
              valueState={fieldErrors.startDate ? "Negative" : "None"}
              accessibleDescriptionRef={fieldErrors.startDate ? "startDate-error" : undefined}
            />
          </FormField>
          <FormField
            required
            label="Until"
            error={fieldErrors.endDate}
            errorId="endDate-error"
            className="date-range-item"
          >
            <DatePicker
              readonly
              required
              value={formValues.endDate}
              valueState={fieldErrors.endDate ? "Negative" : "None"}
              accessibleDescriptionRef={fieldErrors.endDate ? "endDate-error" : undefined}
            />
          </FormField>
          <FormItem labelContent={<Label>Notes (optional)</Label>}>
            <TextArea
              rows={5}
              readonly={readonly}
              value={formValues.notes}
              onInput={(e) => handleFieldChange("notes", e.target.value)}
            />
          </FormItem>
        </FormGroup>
      </Form>
    </>
  );
}
