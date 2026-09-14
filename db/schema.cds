using {
    cuid,
    managed
} from '@sap/cds/common';

namespace festival;

entity Events : cuid, managed {
    name        : String;
    description : String;
    startDate   : Date;
    endDate     : Date;
    timeslots   : Composition of many Timeslots
                      on timeslots.event = $self;
}

type TimeSlotStatus     : String enum {
    open;
    confirmed;
    requested
};

entity Timeslots : cuid, managed {
    name      : String;
    date      : Date;
    startTime : Time;
    endTime   : Time;
    event     : Association to Events not null;
    artist    : Association to Artists;
    status    : TimeSlotStatus default #open;
}

entity Artists : cuid, managed {
    name           : String;
    genre          : String;
    timeslots      : Association to many Timeslots
                         on timeslots.artist = $self;
    availabilities : Composition of many Availabilities
                         on availabilities.artist = $self;
}

type AvailabilityStatus : String enum {
    available;
    unavailable
};

entity Availabilities : cuid, managed {
    date   : Date;
    status : AvailabilityStatus default #available;
    artist : Association to Artists not null;
}

annotate Availabilities with @assert.unique.perArtistDate: [
    artist,
    date
]
