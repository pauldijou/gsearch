'use strict';

gsearchApp.controller('UserCtrl', ['$scope', '$routeParams', 'user', 'util', function($scope, $routeParams, user, util) {
    $scope.login = $routeParams.login;
    $scope.isUser = true;
    
    $scope.getFavoriteLabel = function(owner, name) {
        if(owner && name) {
            if(util.isFavoriteRepo(util.getRepoFullName(owner, name))) {
                return 'Favorite';
            } else {
                return 'Add to favorites';
            }
        }
        else {
            if(util.isFavoriteUser($scope.login)) {
                return 'Favorite';
            } else {
                return 'Add to favorites';
            }
        }
    }

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
