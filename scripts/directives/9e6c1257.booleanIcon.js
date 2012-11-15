'use strict';

gsearchApp.directive('booleanIcon', function() {
  return {
      restrict: 'E',
      transclude : false,
      replace : true,
      scope : {
          value: "="
      },
      template: '<i data-ng-class="{\'icon-ok\': value, \'icon-remove\': !value}"></i>'
    };
});
