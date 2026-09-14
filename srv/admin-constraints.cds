using {AdminService} from './admin-service.cds';

annotate AdminService.Events with {
    name       @mandatory;
    startDate  @mandatory  @assert: (case
                                         when startDate > endDate
                                              then 'Start date should be before end date'
                                     end);
    endDate    @mandatory  @assert: (case
                                         when endDate < startDate
                                              then 'End date should be after start date'
                                     end);
}

annotate AdminService.Timeslots with {
    name       @mandatory;
    date       @mandatory  @assert: (case
                                         when date    < event.startDate
                                              or date > event.endDate
                                              then 'Date should be within event dates'
                                     end);
    startTime  @mandatory  @assert: (case
                                         when startTime > endTime
                                              then 'Start time should be before end time'
                                         when startTime == endTime
                                              then 'Start time cannot be equal to end time'
                                     end);
    endTime    @mandatory  @assert: (case
                                         when endTime < startTime
                                              then 'End time should be after start time'
                                         when endTime == startTime
                                              then 'End time cannot be equal to start time'
                                     end);
    event      @mandatory;
}

annotate AdminService.Artists with {
    name @mandatory;
}

annotate AdminService.Availabilities with {
    date   @mandatory;
    status @mandatory;
    artist @mandatory;
}
