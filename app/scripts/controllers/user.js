'use strict';

gsearchApp.controller('UserCtrl', ['$scope', '$routeParams', 'user', function($scope, $routeParams, user) {
    $scope.login = $routeParams.login;
    $scope.isUser = true;

    // Request user info from GitHub
    $scope.user = user.get({
        // Request params
        login : $scope.login
    }, function() {
        if($scope.user.type.toLowerCase() === 'organisation') {
            $scope.isUser = false;
        }
    });

    // Request all repos of user
    $scope.repos = user.repos({
        login : $scope.login
    });
}]);
