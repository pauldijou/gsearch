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
  select2: {
     allowClear: true
  },
  
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

function addMessage(message, severity) {
    var cssClasses = 'alert';
    
    if(severity) {
        cssClasses += ' alert-'+severity;
    }
    
    $("#msg").append('<div class="'+cssClasses+'"> <button type="button" class="close" data-dismiss="alert">×</button>'+message+'</div>');
}

function info(message) {
    addMessage(message, 'info');
}

function success(message) {
    addMessage(message, 'success');
}

function warn(message) {
    addMessage(message, 'warning');
}

function error(message) {
    addMessage(message, 'error');
}

function cleanMessages() {
    $("#msg > div").remove();
}

$.blockUI.defaults.baseZ = 10000;

function block() {
    $.blockUI({ message: '<h1><img src="images/wait.gif" /> <span class="hidden-phone">Just a moment...</span></h1>' });
}

function unblock() {
    $.unblockUI()
}

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

function getColorAt(index) {
    if(index >= Highcharts.getOptions().colors.length) {
        index = index % Highcharts.getOptions().colors.length;
    }
    
    return Highcharts.getOptions().colors[index];
}