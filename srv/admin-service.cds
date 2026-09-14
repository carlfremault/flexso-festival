using {festival} from '../db/schema';

service AdminService @(odata: '/admin') {
    entity Events as projection on festival.Events;
    entity Timeslots as projection on festival.Timeslots;
    entity Artists as projection on festival.Artists;
    entity Availabilities as projection on festival.Availabilities;
}