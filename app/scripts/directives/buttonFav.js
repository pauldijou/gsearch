'use strict';

gsearchApp.directive('buttonFav', function() {
  return {
    restrict: 'E',
    transclude : false,
    replace : true,
    scope : {
        isFavorite: "=",
        onClick: "&",
        label: "=",
        tooltip: "=",
        size: "@"
    },
    template: '<button type="button" class="btn" data-ng-class="{\'btn-primary\': isFavorite, \'btn-small\': size == \'small\', \'btn-large\': size == \'large\'}" data-ng-click="onClick({$event: $event})" data-original-title="{{tooltip}}" data-ui-jq="tooltip">' +
        '<i class="icon-star" data-ng-class="{\'icon-white\': isFavorite}"></i> {{label}}' +
        '</button>'
  };
});
