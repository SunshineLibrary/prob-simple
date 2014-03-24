'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
        'ngRoute',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers'
    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
        $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
        $routeProvider.when('/lesson/:lessonId', {templateUrl: 'partials/editor/lesson.html', controller: 'LessonController'});
        $routeProvider.when('/activity/:activityId', {templateUrl: 'partials/editor/activity.html', controller: 'ActivityController'});
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]);
