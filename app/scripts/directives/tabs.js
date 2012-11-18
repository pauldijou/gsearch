'use strict';

gsearchApp.directive('tabs', function() {
    return {
        restrict : 'E',
        transclude : true,
        replace : true,
        scope : {
            type: '@'
        },
        controller : ['$scope', '$element', function($scope, $element) {
            $scope.tabs = [];

            $scope.select = function(tab) {
                angular.forEach($scope.tabs, function(tab) {
                    tab.selected = false;
                });
                tab.selected = true;
                if(tab.onSelected) {
                    tab.onSelected();
                }
            }

            this.add = function(tab) {
                if ($scope.tabs.length == 0) {
                    $scope.select(tab);
                }
                $scope.tabs.push(tab);
            }
            
            $scope.getNavClass = function() {
                return 'nav-' + ($scope.type || 'tab') + 's';
            }
        }],
        template : '<div class="tabbable">' + '<ul class="nav" data-ng-class="getNavClass()">'
                + '<li data-ng-repeat="tab in tabs" data-ng-class="{active:tab.selected}">'
                + '<a href="" data-ng-click="select(tab)">{{tab.title}}</a>' + '</li>' + '</ul>'
                + '<div class="tab-content" data-ng-transclude=""></div>' + '</div>'
    };
});
