import { useEffect, useImperativeHandle } from "react";
import {
  ComboBox,
  ComboBoxItem,
  DatePicker,
  Form,
  FormGroup,
  Input,
  MessageStrip,
  OptionCustom,
  Select,
  TimePicker,
} from "@ui5/webcomponents-react";

import type { Timeslot } from "#cds-models/AdminService";
import type { TimeslotStatus } from "#cds-models/festival";

import { useToast } from "@/components/layout/Toast";
import FormField from "@/components/ui/FormField";
import { useAllArtists } from "@/features/artists/queries";
import { useEvent } from "@/features/events/adminQueries";
import { useEventId } from "@/hooks/useEventId";
import { useFormState } from "@/hooks/useFormState";
import { type CdsDate, type CdsTime, isCdsDate, isCdsTime } from "@/utils/dateTimeUtils";

import { useCreateTimeslot, useUpdateTimeslot } from "../adminQueries";
import { isTimeslotStatus, TIMESLOT_STATUS_CONFIG, TIMESLOT_STATUS_OPTIONS } from "../timeslots";
import type { PersistedTimeslot } from "../types";

import { TimeslotStatusBadge } from "./TimeslotStatusBadge";

import "./TimeslotForm.css";

export interface TimeslotFormHandle {
  submit: () => void;
}

function getInitialValues(timeslot?: Timeslot) {
  return {
    name: timeslot?.name ?? "",
    date: timeslot?.date ?? "",
    startTime: timeslot?.startTime ?? "",
    endTime: timeslot?.endTime ?? "",
    artist_ID: timeslot?.artist_ID ?? "",
    status: timeslot?.status ?? "open",
  };
}

type TimeslotFieldErrors = Partial<Record<keyof ReturnType<typeof getInitialValues>, string>>;
const TIMESLOT_FORM_FIELDS = Object.keys(getInitialValues()) as (keyof TimeslotFieldErrors)[];

interface TimeslotFormProps {
  ref: React.Ref<TimeslotFormHandle>;
  onClose: () => void;
  onStateChange: (isFormDisabled: boolean) => void;
  timeslot?: PersistedTimeslot;
}

export default function TimeslotForm(props: TimeslotFormProps) {
  const { ref, onClose, onStateChange, timeslot } = props;
  const editMode = !!timeslot;
  const eventId = useEventId();

  // HOOKS
  const { data: artists } = useAllArtists();
  const { data: event } = useEvent(eventId);

  const { showToast } = useToast();

  const { mutate: createTimeslot, isPending: isCreating } = useCreateTimeslot();
  const { mutate: updateTimeslot, isPending: isUpdating } = useUpdateTimeslot();
  const isPending = isCreating || isUpdating;

  const {
    formValues,
    fieldErrors,
    setFieldErrors,
    formError,
    handleFieldChange,
    handleError,
    handleReset,
    isDirty,
  } = useFormState(getInitialValues(timeslot), TIMESLOT_FORM_FIELDS);

  useEffect(() => {
    const isFormDisabled = !isDirty || isPending;
    onStateChange(isFormDisabled);
  }, [isDirty, isPending]);

  // HANDLERS
  const handleEditSuccess = () => {
    showToast("Timeslot updated!");
    handleReset();
    onClose();
  };
  const handleCreateSuccess = () => {
    showToast("Timeslot created!");
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    const trimmedName = formValues.name.trim();
    handleFieldChange("name", trimmedName);
    const errors: Partial<TimeslotFieldErrors> = {};

    if (!trimmedName) errors.name = "Name is required";
    if (!isCdsDate(formValues.date)) errors.date = "Date is required";
    if (!isCdsTime(formValues.startTime)) errors.startTime = "Start time is required";
    if (!isCdsTime(formValues.endTime)) errors.endTime = "End time is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      name: trimmedName,
      date: formValues.date as CdsDate,
      startTime: formValues.startTime as CdsTime,
      endTime: formValues.endTime as CdsTime,
      artist_ID: formValues.artist_ID || null,
      event_ID: eventId,
      status: formValues.status as TimeslotStatus,
    };

    if (editMode) {
      updateTimeslot(
        { id: timeslot.ID, eventId, body: payload },
        { onSuccess: handleEditSuccess, onError: handleError },
      );
    } else {
      createTimeslot(payload, { onSuccess: handleCreateSuccess, onError: handleError });
    }
  };

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(),
  }));

  return (
    <>
      {formError && (
        <MessageStrip design="Negative" role="alert" hideCloseButton>
          {formError}
        </MessageStrip>
      )}
      <Form accessibleName="Timeslot details" labelSpan="S12 M12 L12 XL12" layout="S1 M1 L2 XL2">
        <FormGroup colSpan="S1 M2 L2 XL2">
          <FormField required label="Name" error={fieldErrors.name} errorId="name-error">
            <Input
              type="Text"
              required
              value={formValues.name}
              onInput={(e) => handleFieldChange("name", e.target.value)}
              valueState={fieldErrors.name ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.name}</span>}
              accessibleDescriptionRef={fieldErrors.name ? "name-error" : undefined}
              style={{ width: "100%" }}
            />
          </FormField>
          <FormField required label="Date" error={fieldErrors.date} errorId="date-error">
            <DatePicker
              required
              value={formValues.date}
              valueFormat="yyyy-MM-dd"
              displayFormat="medium"
              onChange={(e) => handleFieldChange("date", e.target.value)}
              valueState={fieldErrors.date ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.date}</span>}
              accessibleDescriptionRef={fieldErrors.date ? "date-error" : undefined}
              minDate={event.startDate}
              maxDate={event.endDate}
            />
          </FormField>
          <FormField
            required
            label="Start time"
            error={fieldErrors.startTime}
            errorId="startTime-error"
            className="time-range-item"
          >
            <TimePicker
              required
              value={formValues.startTime}
              valueFormat="HH:mm:ss"
              displayFormat="HH:mm:ss"
              onChange={(e) => handleFieldChange("startTime", e.target.value)}
              valueState={fieldErrors.startTime ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.startTime}</span>}
              accessibleDescriptionRef={fieldErrors.startTime ? "startTime-error" : undefined}
            />
          </FormField>
          <FormField
            required
            label="End time"
            error={fieldErrors.endTime}
            errorId="endTime-error"
            className="time-range-item"
          >
            <TimePicker
              required
              value={formValues.endTime}
              valueFormat="HH:mm:ss"
              displayFormat="HH:mm:ss"
              onChange={(e) => handleFieldChange("endTime", e.target.value)}
              valueState={fieldErrors.endTime ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.endTime}</span>}
              accessibleDescriptionRef={fieldErrors.endTime ? "endTime-error" : undefined}
            />
          </FormField>
          <FormField label="Artist" error={fieldErrors.artist_ID} errorId="artist_ID-error">
            <ComboBox
              className="timeslot-form-select"
              selectedValue={formValues.artist_ID}
              placeholder="Select an artist"
              onSelectionChange={(e) => handleFieldChange("artist_ID", e.detail.item?.value ?? "")}
              valueState={fieldErrors.artist_ID ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.artist_ID}</span>}
            >
              {artists.map((artist) => (
                <ComboBoxItem key={artist.ID} text={artist.name ?? ""} value={artist.ID} />
              ))}
            </ComboBox>
          </FormField>
          <FormField label="Status" error={fieldErrors.status} errorId="status-error">
            <Select
              className="timeslot-form-select"
              onChange={(e) => {
                const value = e.detail.selectedOption.value;
                if (isTimeslotStatus(value)) handleFieldChange("status", value);
              }}
              valueState={fieldErrors.status ? "Negative" : "None"}
              valueStateMessage={<span>{fieldErrors.status}</span>}
              accessibleDescriptionRef={fieldErrors.status ? "status-error" : undefined}
            >
              {TIMESLOT_STATUS_OPTIONS.map((key) => (
                <OptionCustom
                  key={key}
                  value={key}
                  displayText={TIMESLOT_STATUS_CONFIG[key].label}
                  selected={key === formValues.status}
                >
                  <TimeslotStatusBadge status={key} />
                </OptionCustom>
              ))}
            </Select>
          </FormField>
        </FormGroup>
      </Form>
    </>
  );
}
