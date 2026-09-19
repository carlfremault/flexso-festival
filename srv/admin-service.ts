import cds from "@sap/cds";

export class AdminService extends cds.ApplicationService {
  init() {
    const { Events, Timeslots } = this.entities;

    // -----------------------------------------------------------------------------
    // When an event's dates are updated, check if timeslots are still within range.
    // -----------------------------------------------------------------------------
    this.before("UPDATE", Events, async (req) => {
      const { ID, startDate, endDate } = req.data;
      if (startDate === undefined && endDate === undefined) return;

      const event = await SELECT.one.from(Events).columns("startDate", "endDate").where({ ID });
      if (!event) return;

      const newStart = startDate ?? event.startDate;
      const newEnd = endDate ?? event.endDate;
      if (newStart === event.startDate && newEnd === event.endDate) return;

      const timeslots = await SELECT.from(Timeslots)
        .where`event_ID = ${ID} and (date < ${newStart} or date > ${newEnd})`;

      if (timeslots.length) {
        req.warn({
          code: "TIMESLOTS_OUT_OF_RANGE",
          message: "Some timeslots fall outside the event dates and need rescheduling",
        });
      }
    });

    return super.init();
  }
}
