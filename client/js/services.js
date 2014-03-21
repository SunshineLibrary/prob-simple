'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1')
    .factory('Chapters', ['$resource', function ($resource) {
        return $resource('/1/chapters/:chapterId');
    }]).
    factory('Lessons', ['$resource', function ($resource) {
        return $resource('/1/lessons/:lessonId', {lessonId: '@_id'});
    }]).
    factory('Activities', ['$resource', function ($resource) {
        return $resource('/1/activities/:activityId', {activityId: '@_id'});
    }]).
    factory('Problems', ['$resource', function ($resource) {
        return $resource('/1/problems/:problemId', {problemId: '@_id'});
    }]).
    factory('Utils', ['$resource', function ($resource) {
        var ACTIVITY_TYPES = [
            {
                "type": "lecture",
                "title": "讲义",
                "editorId": "editLectureDialog"
            },
            {
                "type": "quiz",
                "title": "题集",
                "editorId": "editLectureDialog"
            },
            {
                "type": "hypervideo",
                "title": "视频",
                "editorId": "editLectureDialog"
            }
        ];
        var PROBLEM_TYPES = [
            {
                "type": "singlechoice",
                "title": "单选题",
                "editorId": ""
            },
            {
                "type": "multichoice",
                "title": "多选题",
                "editorId": ""
            },
            {
                "type": "singlefilling",
                "title": "单空填空题",
                "editorId": ""
            }
        ];
        var SAVE_BUTTON_STATES = {
            save: {
                state: "save",
                title: "保存"
            },
            saving: {
                state: "saving",
                title: "保存中..."
            },
            saved: {
                state: "saved",
                title: "保存完毕"
            }
        }
        return {
            getActivityType: function (param) {
                return _.find(ACTIVITY_TYPES, function (type) {
                    if (param === type.type) {
                        return true;
                    }
                });
            },
            allActivityTypes: ACTIVITY_TYPES,
            getProblemType: function (param) {
                return _.find(PROBLEM_TYPES, function (type) {
                    if (param === type.type) {
                        return true;
                    }
                });
            },
            allProblemTypes: PROBLEM_TYPES,
            allSaveButtonStates: SAVE_BUTTON_STATES
        };
    }])
;
