'use strict';

gsearchApp.directive('buttonFav', function() {
  return {
    restrict: 'E',
    transclude : false,
    replace : true,
    scope : {
        isFavorite: "=",
        eventData: "@",
        label: "=",
        tooltip: "=",
        size: "@"
    },
    controller : ['$scope', '$element', function($scope, $element) {
        $scope.getEventData = function() {
            return $scope.$eval('{' + $scope.eventData + '}');
        }
    }],
    template: '<button type="button" class="btn" data-ng-class="{\'btn-primary\': isFavorite, \'btn-small\': size == \'small\', \'btn-large\': size == \'large\'}" data-ng-click="$emit(\'button-fav\', getEventData())" data-original-title="{{tooltip}}" data-ui-jq="tooltip">' +
        '<i class="icon-star" data-ng-class="{\'icon-white\': isFavorite}"></i> {{label}}' +
        '</button>'
  };
});
