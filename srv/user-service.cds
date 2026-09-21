using {festival} from '../db/schema';
using {ArtistsWithBookings} from './shared-projections';

service UserService @(odata: '/user') {
    entity Events    as projection on festival.Events;

    entity Timeslots as projection on festival.Timeslots
                        where
                                date >= event.startDate
                            and date <= event.endDate;

    entity Artists   as
        projection on ArtistsWithBookings
        excluding {
            availabilities,
            timeslots
        };

    function whoami()                                        returns {
        isAdmin    : Boolean;
        id         : String;
        givenName  : String;
        familyName : String;
    };

    function searchArtists(searchString: String @mandatory ) returns array of {
        deezerId : Integer;
        name     : String;
        imageUrl : String;
        nbFans   : Integer;
    };

}
