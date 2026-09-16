import { useImperativeHandle } from "react";
import type { CalendarSelectionChangeEventDetail } from "@ui5/webcomponents/dist/Calendar.js";
import {
  Calendar,
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

import FormField from "../../../components/ui/FormField";
import { useFormState } from "../../../hooks/useFormState";
import { type CdsDate, isCdsDate } from "../../../utils/dateUtils";
import { useCreateEvent } from "../queries";

export interface EventFormHandle {
  submit: () => void;
  isPending: boolean;
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
  onSuccess: () => void;
  event?: Event;
}

export default function EventForm(props: EventFormProps) {
  const { ref, onSuccess, event } = props;

  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();

  const {
    formValues,
    fieldErrors,
    setFieldErrors,
    formError,
    setFormError,
    handleFieldChange,
    handleError,
  } = useFormState(getInitialValues(event), EVENT_FORM_FIELDS);

  const handleChangeDateRange = (e: CustomEvent<CalendarSelectionChangeEventDetail>) => {
    handleFieldChange("startDate", e.detail.selectedValues[0]);
    handleFieldChange("endDate", e.detail.selectedValues[1]);
  };

  const handleSuccess = () => {
    setFieldErrors({});
    setFormError(null);
    onSuccess();
  };

  const handleSubmit = () => {
    const trimmedName = formValues.name.trim();
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

    createEvent(payload, { onSuccess: handleSuccess, onError: handleError });
  };

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(),
    isPending: isCreating,
  }));

  return (
    <>
      {formError && (
        <MessageStrip design="Negative" hideCloseButton>
          {formError}
        </MessageStrip>
      )}
      <Form headerText="Event details" labelSpan="S12 M12 L12 XL12" layout="S1 M2 L3 XL3">
        <FormGroup colSpan="S1 M1 L1 XL1">
          <FormItem className="calendar-form-item">
            <Calendar
              aria-label="Event dates"
              onSelectionChange={(e) => handleChangeDateRange(e)}
              primaryCalendarType="Gregorian"
              selectionMode="Range"
              valueFormat="yyyy-MM-dd"
            />
          </FormItem>
        </FormGroup>
        <FormGroup colSpan="S1 M1 L2 XL2">
          <FormField label="Name" error={fieldErrors.name} errorId="name-error">
            <Input
              type="Text"
              required
              value={formValues.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              valueState={fieldErrors.name ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.name}</span>}
              accessibleDescriptionRef={fieldErrors.name ? "name-error" : undefined}
              style={{ width: "100%" }}
            />
          </FormField>
          <FormField
            label="From"
            error={fieldErrors.startDate}
            errorId="startDate-error"
            className="date-range-item"
          >
            <DatePicker
              readonly
              value={formValues.startDate}
              valueState={fieldErrors.startDate ? "Negative" : "None"}
              accessibleDescriptionRef={fieldErrors.startDate ? "startDate-error" : undefined}
            />
          </FormField>
          <FormField
            label="Until"
            error={fieldErrors.endDate}
            errorId="endDate-error"
            className="date-range-item"
          >
            <DatePicker
              readonly
              value={formValues.endDate}
              valueState={fieldErrors.endDate ? "Negative" : "None"}
              accessibleDescriptionRef={fieldErrors.endDate ? "endDate-error" : undefined}
            />
          </FormField>
          <FormItem labelContent={<Label>Notes (optional)</Label>}>
            <TextArea
              rows={5}
              value={formValues.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
            />
          </FormItem>
        </FormGroup>
      </Form>
    </>
  );
}
