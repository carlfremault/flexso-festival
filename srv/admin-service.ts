import cds from "@sap/cds";

export class AdminService extends cds.ApplicationService {
  init() {
    const { Artists, Events, Timeslots } = this.entities;

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

    // ----------------------------------------------------------------------------------
    // When an artist is deleted, clear them from all timeslots and set them back to open.
    // ----------------------------------------------------------------------------------
    this.before("DELETE", Artists, async (req) => {
      const { ID } = req.data;

      await UPDATE(Timeslots).set({ artist_ID: null, status: "open" }).where({ artist_ID: ID });
    });

    return super.init();
  }
}
