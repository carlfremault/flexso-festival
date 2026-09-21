using {festival} from '../db/schema';

type ArtistBookingStatus : String enum {
    booked;
    requested;
    available
};

entity ArtistsWithBookings as
    projection on festival.Artists {
        *,
        case
            when exists timeslots[status = #confirmed]
                 then 'booked'
            when exists timeslots[status = #requested]
                 then 'requested'
            else 'available'
        end                            as bookingStatus : ArtistBookingStatus,
        timeslots[status = #confirmed] as bookings,
        timeslots[status = #requested] as requests
    };
