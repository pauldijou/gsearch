'use strict';

var gsearchApp = angular.module('gsearchApp', ['ngResource', 'ui'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/repo/:owner/:name', {
        templateUrl: 'views/repo.html',
        controller: 'RepoCtrl'
      })
      .when('/user/:login', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
}]);

gsearchApp.value('ui.config', {
  jq: {
      tooltip: {
          placement: 'right'
      },
      popover: {
          placement: 'right',
          trigger: 'hover',
          html: 'true'
      }
  }
});

$.blockUI.defaults.baseZ = 10000;

Date.prototype.toFirstDayWeek = function() {
    this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0 ? -6:1));
}

Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function(color) {
    return {
        radialGradient : {
            cx : 0.5,
            cy : 0.3,
            r : 0.7
        },
        stops : [ [ 0, color ], [ 1, Highcharts.Color(color).brighten(-0.3).get('rgb') ] ]
    };
});