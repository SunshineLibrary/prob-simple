'use strict';

/* Directives */


angular.module('myApp.directives', [])
    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive("mathjaxBind", function () {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs",
                function ($scope, $element, $attrs) {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.$watch($attrs.mathjaxBind, function (value) {
                                $element.html(value == undefined ? "" : value);
                                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                            });
                        });
                    }, 0);
                }]
        };
    })
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
    .directive('lectureEditor', function () {
        return {
            templateUrl: 'partials/editor/lecture.html'
        };
    })
    .directive('xcheckbox', function () {
        return {
            scope: {
                title: '@title',
                target: '=target'
            },
            link: function ($scope, $element, $attrs) {
                $scope.checkboxId = uuid.v4();
            },
            templateUrl: 'partials/common/checkbox.html'
        };
    });
