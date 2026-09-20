using {AdminService} from './admin-service.cds';
using {UserService} from './user-service.cds';

annotate AdminService with @(requires: 'admin');
annotate UserService with @(requires: 'authenticated-user');

annotate UserService.Events with @readonly;
annotate UserService.Timeslots with @readonly;

annotate UserService.Artists with @(restrict: [{
    grant: [
        'READ',
        'CREATE'
    ],
    to   : 'authenticated-user'
}]);
