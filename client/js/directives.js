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
    })
    .directive('uploadEditor', function () {
        return {
            scope: {
                target: '=target'
            },
            link: function ($scope, $element, $attrs) {
                var wrapImg = function (url) {
                    return "<div><img src='" + url + "'></img></div>";
                }
                var editorElement = $element.find('textarea')[0];
                var indicatorElement = $element.find('span')[0];
                window.ondragover = function (e) {
                    e.preventDefault()

                }
                editorElement.ondrop = function (e) {
                    e.preventDefault();
                    var uploadFile = e.dataTransfer.files[0];
                    if (!e.dataTransfer.files[0]) {
                        console.log('invalid file');
                    } else {
                        angular.element(indicatorElement).addClass("flash");
                        angular.element(indicatorElement).addClass("animated");
                        filepicker.store(uploadFile, function (InkBlob) {
                                console.log("Store successful:", JSON.stringify(InkBlob));
                                $scope.$apply(function () {
                                    $scope.progress = undefined;
                                    $scope.target = $scope.target + wrapImg(InkBlob.url);
                                    angular.element(indicatorElement).removeClass("flash");
                                    angular.element(indicatorElement).removeClass("animated");
                                });
                            }, function (FPError) {
                                console.log(FPError.toString());
                                $scope.progress = undefined;
                                $scope.$apply(function () {
                                    angular.element(indicatorElement).removeClass("flash");
                                    angular.element(indicatorElement).removeClass("animated");
                                });
                            }, function (progress) {
                                $scope.$apply(function () {
                                    $scope.progress = progress + "%";
                                });
                            }
                        );
                    }
                }
            },
            templateUrl: 'partials/common/uploadeditor.html'
        };
    })
    .constant('msdElasticConfig', {
        append: ''
    })
    .directive('msdElastic', ['$timeout', '$window', 'msdElasticConfig', function ($timeout, $window, config) {
        'use strict';

        return {
            require: 'ngModel',
            restrict: 'A, C',
            link: function (scope, element, attrs, ngModel) {

                // cache a reference to the DOM element
                var ta = element[0],
                    $ta = element;

                // ensure the element is a textarea, and browser is capable
                if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
                    return;
                }

                // set these properties before measuring dimensions
                $ta.css({
                    'overflow': 'hidden',
                    'overflow-y': 'hidden',
                    'word-wrap': 'break-word'
                });

                // force text reflow
                var text = ta.value;
                ta.value = '';
                ta.value = text;

                var appendText = attrs.msdElastic || config.append,
                    append = appendText === '\\n' ? '\n' : appendText,
                    $win = angular.element($window),
                    mirrorStyle = 'position: absolute; top: -999px; right: auto; bottom: auto; left: 0 ;' +
                        'overflow: hidden; -webkit-box-sizing: content-box;' +
                        '-moz-box-sizing: content-box; box-sizing: content-box;' +
                        'min-height: 0 !important; height: 0 !important; padding: 0;' +
                        'word-wrap: break-word; border: 0;',
                    $mirror = angular.element('<textarea tabindex="-1" ' +
                        'style="' + mirrorStyle + '"/>').data('elastic', true),
                    mirror = $mirror[0],
                    taStyle = getComputedStyle(ta),
                    resize = taStyle.getPropertyValue('resize'),
                    borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                        taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                        taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                    boxOuter = !borderBox ? {width: 0, height: 0} : {
                        width: parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                            parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                        height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                            parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                    },
                    minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                    heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                    minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                    maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                    mirrored,
                    active,
                    copyStyle = ['font-family',
                        'font-size',
                        'font-weight',
                        'font-style',
                        'letter-spacing',
                        'line-height',
                        'text-transform',
                        'word-spacing',
                        'text-indent'];

                // exit if elastic already applied (or is the mirror element)
                if ($ta.data('elastic')) {
                    return;
                }

                // Opera returns max-height of -1 if not set
                maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                // append mirror to the DOM
                if (mirror.parentNode !== document.body) {
                    angular.element(document.body).append(mirror);
                }

                // set resize and apply elastic
                $ta.css({
                    'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
                }).data('elastic', true);

                /*
                 * methods
                 */

                function initMirror() {
                    mirrored = ta;
                    // copy the essential styles from the textarea to the mirror
                    taStyle = getComputedStyle(ta);
                    angular.forEach(copyStyle, function (val) {
                        mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                    });
                    mirror.setAttribute('style', mirrorStyle);
                }

                function adjust() {
                    var taHeight,
                        mirrorHeight,
                        width,
                        overflow;

                    if (mirrored !== ta) {
                        initMirror();
                    }

                    // active flag prevents actions in function from calling adjust again
                    if (!active) {
                        active = true;

                        mirror.value = ta.value + append; // optional whitespace to improve animation
                        mirror.style.overflowY = ta.style.overflowY;

                        taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

                        // update mirror width in case the textarea width has changed
                        width = parseInt(getComputedStyle(ta).getPropertyValue('width'), 10) - boxOuter.width;
                        mirror.style.width = width + 'px';

                        mirrorHeight = mirror.scrollHeight;

                        if (mirrorHeight > maxHeight) {
                            mirrorHeight = maxHeight;
                            overflow = 'scroll';
                        } else if (mirrorHeight < minHeight) {
                            mirrorHeight = minHeight;
                        }
                        mirrorHeight += boxOuter.height;

                        ta.style.overflowY = overflow || 'hidden';

                        if (taHeight !== mirrorHeight) {
                            ta.style.height = mirrorHeight + 'px';
                            scope.$emit('elastic:resize', $ta);
                        }

                        // small delay to prevent an infinite loop
                        $timeout(function () {
                            active = false;
                        }, 1);

                    }
                }

                function forceAdjust() {
                    active = false;
                    adjust();
                }

                /*
                 * initialise
                 */

                // listen
                if ('onpropertychange' in ta && 'oninput' in ta) {
                    // IE9
                    ta['oninput'] = ta.onkeyup = adjust;
                } else {
                    ta['oninput'] = adjust;
                }

                $win.bind('resize', forceAdjust);

                scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newValue) {
                    forceAdjust();
                });

                scope.$on('elastic:adjust', function () {
                    forceAdjust();
                });

                $timeout(adjust);

                /*
                 * destroy
                 */

                scope.$on('$destroy', function () {
                    $mirror.remove();
                    $win.unbind('resize', forceAdjust);
                });
            }
        };

    }]);
