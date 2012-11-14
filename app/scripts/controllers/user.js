'use strict';

gsearchApp.controller('UserCtrl', function($scope, $routeParams, user) {
  $scope.username = $routeParams.username;
  
  //Request user info from GitHub
  $scope.user = user.get({
      // Request params
      username : $scope.username
  });
});
