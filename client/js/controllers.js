'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngResource', 'ngRoute', 'ngSanitize']).
    controller('MyCtrl1', [function () {

    }])
    .controller('MyCtrl2', [function () {

    }])
    .controller('LessonController', ['$scope', '$routeParams', 'Lessons', 'Activities', 'Problems', 'Utils', '$timeout',
        function ($scope, $routeParams, Lessons, Activities, Problems, Utils, $timeout) {
            $scope.utils = Utils;
            $scope.save = function () {
                $scope.lesson.$save();
            };
            $scope.test = "<div>asdasd</div>";
            $scope.refresh = function (cb, err) {
                Lessons.get({lessonId: $routeParams.lessonId, "populate": "activities"}, function (lesson) {
                    $scope.lesson = lesson;
                    if (cb) cb(lesson);
                });
            }
            $scope.save = function () {
                $scope.lesson.$save();
                $scope.refresh();
            };

            $scope.showDialog = function (type, params) {
                if ('newActivity' === type) {
                    $scope.newActivity.type = params[0];
                    $('#newActivityDialog').modal('show');
                } else if ('editActivity' === type) {
                    Activities.get({activityId: params[0]._id},
                        function (activity) {
                            $scope.editActivity = activity;
                            if ("lecture" === $scope.editActivity.type) {
                                $('#editLectureDialog').modal('show');
                            } else if ("quiz" === $scope.editActivity.type) {
                                $('#editQuizDialog').modal('show');
                            } else if ("hypervideo" === $scope.editActivity.type) {
                                $('#editHypervideoDialog').modal('show');
                            }
                        });
                }
            }

            $scope.createActivity = function () {
                // Title
                if (!$scope.newActivity.title) {
                    $scope.newActivity.title = "未命名";
                    $scope.newActivity.parent_id = $scope.lesson._id;
                }

                // Create a activity
                $scope.newActivity.$save(function () {
                    // Refresh data
                    $scope.lesson.activities.push($scope.newActivity._id);
                    $scope.lesson.$save(function () {
                        $scope.refresh();
                        $('#newActivityDialog').modal('hide');
                        $scope.init();
                    });
                });

                // Popup a activity edit dialog
            };

            $scope.removeActivity = function (activity) {
                _.find($scope.lesson.activities, function (a, index) {
                    if (activity._id === a._id) {
                        $scope.lesson.activities.splice(index, 1);
                        $scope.lesson.$save(function () {
                            Activities.delete({activityId: activity._id}, function () {
                                $scope.refresh(function () {
                                    $('#editLectureDialog').modal('hide');
                                    $('#editQuizDialog').modal('hide');
                                    $('#editLectureDialog').modal('hide');
                                });
                            });
                        });
                    }
                });
            };

            $scope.saveActivity = function (activity) {
                activity.$save(function () {
                    $scope.refresh();
                });
            };

            $scope.init = function () {
                $scope.newActivity = new Activities();
                $scope.refresh(function (lesson) {
                    $scope.lesson = lesson;
                });
            };

            $scope.createProblem = function (type) {
                var newProblem = new Problems({type: type});
                newProblem.$save(function () {
                    $scope.editActivity.problems.push(newProblem._id);
                    $scope.editActivity.$save(function () {
                    });
                });
            }

            $scope.removeProblem = function (problem) {
                console.log('remove problem parent,%s', problem._id);
                _.find($scope.editActivity.problems, function (p, index) {
                    if (problem._id === p) {
                        $scope.editActivity.problems.splice(index, 1);
                        $scope.editActivity.$save(function () {
                            problem.$delete(function () {
                                console.log("problem deleted");
                            });
                        });
                    }
                })
            };
//            $timeout(function () {
//                $('[type=checkbox]').checkbox();
//            },0)
        }])
    .directive('xproblemPreview', function () {
        console.log('problem preview');
        return {
            templateUrl: 'partials/preview/problem.html'
        };
    })
    .directive('xproblemEditor', function () {
        return {
            templateUrl: 'partials/editor/problem.html'
        };
    })
    .controller('ProblemController', ['$scope', '$routeParams', 'Lessons', 'Activities', 'Problems', 'Utils', '$timeout',
        function ($scope, $routeParams, Lessons, Activities, Problems, Utils, $timeout) {
            $scope.utils = Utils;
            $scope.saveButtonState = $scope.utils.allSaveButtonStates.save;
            $scope.init = function () {
                Problems.get({problemId: $scope.problem}, function (problem) {
                    $scope.problem = problem;
                });
            };
            $scope.removeProblem = function () {
                console.log('remove problem');
                $scope.$parent.removeProblem($scope.problem);
            };
            $scope.save = function () {
                $scope.saveButtonState = $scope.utils.allSaveButtonStates.saving;
                $scope.problem.$save(function () {
                    $timeout(function () {
                        $scope.saveButtonState = $scope.utils.allSaveButtonStates.saved;
                        $timeout(function () {
                            $scope.saveButtonState = $scope.utils.allSaveButtonStates.save;
                        }, 1500)
                    }, 300);
                });
            };
        }])
    .controller('ProblemPreviewController', ['$scope', '$routeParams', 'Lessons', 'Activities', 'Problems', 'Utils',
        function ($scope, $routeParams, Lessons, Activities, Problems, Utils) {
            $scope.utils = Utils;

            $scope.removeProblem = function () {
                console.log('remove problem');
                $scope.$parent.removeProblem($scope.problem);
            };
            $scope.save = function () {
                $scope.problem.$save();
            };
        }])
    .controller('SinglechoiceProblemController', ['$scope', '$routeParams', 'Lessons', 'Activities', 'Problems',
        function ($scope, $routeParams, Lessons, Activities, Problems) {
            $scope.choiceCount = 0;
            $scope.addChoice = function () {
                // Add a choice
                if (!$scope.problem.choices) {
                    $scope.problem.choices = [];
                }
                var newChoice = {
                    id: uuid.v4(),
                    is_correct: false,
                    seq: $scope.choiceCount++
                };
                $scope.problem.choices.push(newChoice);
                console.log('create new choice,%s', JSON.stringify(newChoice));
            };
            $scope.removeChoice = function (choice) {
                _.find($scope.problem.choices, function (c, index) {
                    if (c === choice) {
                        $scope.problem.choices.splice(index, 1);
                    }
                })
            };
            $scope.setChoiceForQuestion = function (p, c) {
                angular.forEach(p.choices, function (c) {
                    c.is_correct = false;
                });
                c.is_correct = true;
            };
        }
    ])

    .controller('MultichoiceProblemController', ['$scope', '$routeParams', 'Lessons', 'Activities', 'Problems',
        function ($scope, $routeParams, Lessons, Activities, Problems) {
            $scope.choiceCount = 0;

            $scope.addChoice = function () {
                // Add a choice
                if (!$scope.problem.choices) {
                    $scope.problem.choices = [];
                }
                var newChoice = {
                    id: uuid.v4(),
                    is_correct: false,
                    seq: $scope.choiceCount++
                };
                $scope.problem.choices.push(newChoice);
                console.log('create new choice,%s', JSON.stringify(newChoice));
            };
            $scope.removeChoice = function (choice) {
                _.find($scope.problem.choices, function (c, index) {
                    if (c === choice) {
                        $scope.problem.choices.splice(index, 1);
                    }
                })
            };
            $scope.setChoiceForQuestion = function (p, c) {
//                angular.forEach(p.choices, function (c) {
//                    c.is_correct = false;
//                });
                c.is_correct = !c.is_correct;
            }
        }
    ])
    .directive('xcheckbox', function () {
        return {
            link: function ($scope, $element, $attrs) {

            },
            templateUrl: 'partials/common/checkbox.html'
        };
    });