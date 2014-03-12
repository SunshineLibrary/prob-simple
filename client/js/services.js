'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1')
    .factory('Chapters', ['$resource', function ($resource) {
        console.log('chapter service init');
        return $resource('/1/chapters/:chapterId');
    }]).
    factory('Lessons', ['$resource', function ($resource) {
        return $resource('/1/lessons/:lessonId', {lessonId: '@_id'});
    }]).
    factory('Activities', ['$resource', function ($resource) {
        return $resource('/1/activity/:activityId');
    }]);
