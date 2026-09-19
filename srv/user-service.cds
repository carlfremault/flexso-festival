using {festival} from '../db/schema';

service UserService @(odata: '/user') {
    entity Events    as projection on festival.Events;

    entity Timeslots as projection on festival.Timeslots
                        where
                                date >= event.startDate
                            and date <= event.endDate;

    entity Artists   as
        projection on festival.Artists
        excluding {
            availabilities
        };

    function whoami() returns {
        isAdmin : Boolean
    };

}
