using {festival} from '../db/schema';
using {ArtistsWithBookings} from './shared-projections';

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


    entity Artists        as
        projection on ArtistsWithBookings
        excluding {
            availabilities,
            timeslots
        };

    entity Availabilities as projection on festival.Availabilities;
}
