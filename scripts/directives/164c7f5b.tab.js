'use strict';

gsearchApp.directive('tab', function() {
    return {
        require : '^tabs',
        restrict : 'E',
        transclude : true,
        replace : true,
        scope : {
            title : '@',
            onSelected: '&'
        },
        link : function(scope, element, attrs, tabsCtrl) {
            tabsCtrl.add(scope);
        },
        template : '<div class="tab-pane" data-ng-class="{active: selected}" data-ng-transclude="">' + '</div>',
        
    };
});
