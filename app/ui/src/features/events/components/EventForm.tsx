import {
  Calendar,
  DatePicker,
  Form,
  FormGroup,
  FormItem,
  Input,
  Label,
  TextArea,
} from "@ui5/webcomponents-react";

export default function EventForm() {
  return (
    <form>
      <Form headerText="Event details" labelSpan="S12 M12 L12 XL12" layout="S1 M2 L3 XL3">
        <FormGroup colSpan="S1 M1 L1 XL1">
          <FormItem className="calendar-form-item">
            <Calendar
              aria-label="Event dates"
              onSelectionChange={() => console.log("change dates")}
              primaryCalendarType="Gregorian"
              selectionMode="Range"
            />
          </FormItem>
        </FormGroup>
        <FormGroup colSpan="S1 M1 L2 XL2">
          <FormItem labelContent={<Label>Name</Label>}>
            <Input type="Text" />
          </FormItem>
          <FormItem className="date-range-item" labelContent={<Label>From</Label>}>
            <DatePicker readonly />
          </FormItem>
          <FormItem className="date-range-item" labelContent={<Label>Until</Label>}>
            <DatePicker readonly />
          </FormItem>
          <FormItem labelContent={<Label>Notes (optional)</Label>}>
            <TextArea rows={5} />
          </FormItem>
        </FormGroup>
      </Form>
    </form>
  );
}
