(function(angular, undefined) {
'use strict';

angular.module('testApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin']})

;
})(angular);