using {festival} from '../db/schema';

service AdminService @(odata: '/admin') {
    entity Events         as projection on festival.Events;

    entity Timeslots      as
        projection on festival.Timeslots {
            *,
            case
                when date < event.startDate
                     or date > event.endDate
                     then true
                else false
            end as needsRescheduling : Boolean
        };

    entity Artists        as projection on festival.Artists;
    entity Availabilities as projection on festival.Availabilities;
}
