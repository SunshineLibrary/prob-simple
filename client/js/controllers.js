'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngResource', 'ngRoute']).
    controller('MyCtrl1', [function () {

    }])
    .controller('MyCtrl2', [function () {

    }])
    .controller('LessonController', ['$scope', '$routeParams', 'Lessons',
        function ($scope, $routeParams, Lessons) {
            $scope.init = function () {
                Lessons.get({lessonId: $routeParams.lessonId }, function (lesson) {
                    $scope.lesson = lesson;
                    $scope.save = function () {
                        alert('saved');
                        lesson.$save();
                    };
                    $scope.lesson.activities = ['asd', 'asd']
                    $scope.addActivity = function () {

                    };
                    $scope.showDialog = function (type, params) {

                    }
                });
            }
        }]);
