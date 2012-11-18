'use strict';

gsearchApp.controller('AppCtrl', ['$scope', '$location', 'searchRepos', 'searchUsers', 'util', function($scope, $location, searchRepos, searchUsers, util) {
    $scope.search = "";
    $scope.isUserSearch = false;
    $scope.result = [];

    $scope.doSearch = function() {
        util.block();
        if ($scope.isSearchForUser()) {
            var users = searchUsers.query({
                keyword : $scope.search
            }, function() {
                util.cleanMessages();
                $scope.result = users.users;
                $scope.isUserSearch = true;
                $location.path('/');
                if (users.users.length == 0) {
                    util.error('No respository found.');
                }
                util.unblock();
            }, function() {
                util.cleanMessages();
                $scope.result = [];
                $location.path('/');
                util.error('No respository found.');
                util.unblock();
            });
        } else {
            var repos = searchRepos.query({
                keyword : $scope.search
            }, function() {
                util.cleanMessages();
                $scope.result = repos.repositories;
                $scope.isUserSearch = false;
                $location.path('/');
                if (repos.repositories.length == 0) {
                    util.error('No respository found.');
                }
                util.unblock();
            }, function() {
                util.cleanMessages();
                $scope.result = [];
                $location.path('/');
                util.error('No respository found.');
                util.unblock();
            });
        }
    }
    
    $scope.cleanResult = function() {
        $scope.result = [];
        $location.path('/');
    }
    
    $scope.isSearchForUser = function() {
        return ($scope.search.indexOf("@") == 0);
    }
    
    $scope.hasResult = function() {
        return $scope.result.length > 0;
    }
    
    $scope.plural = function(num, char) {
        char = char || 's';
        
        if(num > 1) {
            return char;
        } else {
            return '';
        }
    }
    
    $scope.getRepoFullName = function(owner, repoName) {
        return owner + '/' + repoName;
    }
    
    $scope.showRepo = function(repoFullName) {
        $location.path('repo/'+repoFullName);
    }
    
    $scope.showUser = function(login) {
        $location.path('user/'+login);
    }
    
    $scope.getFavoriteRepos = function() {
        return angular.fromJson(localStorage.getItem('favoriteRepos')) || (new Array());
    }

    $scope.getFavoriteUsers = function() {
        return angular.fromJson(localStorage.getItem('favoriteUsers')) || (new Array());
    }

    $scope.setFavoriteRepos = function(favoriteRepos) {
        localStorage.setItem('favoriteRepos', angular.toJson(favoriteRepos));
    }

    $scope.setFavoriteUsers = function(favoriteUsers) {
        localStorage.setItem('favoriteUsers', angular.toJson(favoriteUsers));
    }

    $scope.clearFavoriteRepos = function() {
        localStorage.removeItem('favoriteRepos');
    }

    $scope.clearFavoriteUsers = function() {
        localStorage.removeItem('favoriteUsers');
    }

    $scope.hasFavoriteRepos = function() {
        return $scope.getFavoriteRepos().length > 0;
    }

    $scope.hasFavoriteUsers = function() {
        return $scope.getFavoriteUsers().length > 0;
    }

    $scope.isFavoriteRepo = function(repoFullName) {
        return _.indexOf($scope.getFavoriteRepos(), repoFullName) > -1;
    }

    $scope.isFavoriteUser = function(login) {
        return _.indexOf($scope.getFavoriteUsers(), login) > -1;
    }
    
    $scope.toggleFavoriteRepo = function(repoFullName, $event) {
        if($scope.isFavoriteRepo(repoFullName)) {
            $scope.removeFavoriteRepo(repoFullName, $event);
        } else {
            $scope.addFavoriteRepo(repoFullName, $event);
        }
    }
    
    $scope.toggleFavoriteUser = function(login, $event) {
        if($scope.isFavoriteUser(login)) {
            $scope.removeFavoriteUser(login, $event);
        } else {
            $scope.addFavoriteUser(login, $event);
        }
    }

    $scope.addFavoriteRepo = function(repoFullName, $event) {
        $event.stopPropagation();
        var favoriteRepos = $scope.getFavoriteRepos();
        favoriteRepos.push(repoFullName)
        $scope.setFavoriteRepos(favoriteRepos);
    }

    $scope.addFavoriteUser = function(login, $event) {
        $event.stopPropagation();
        var favoriteUsers = $scope.getFavoriteUsers();
        favoriteUsers.push(login)
        $scope.setFavoriteUsers(favoriteUsers);
    }

    $scope.removeFavoriteRepo = function(repoFullName, $event) {
        $event.stopPropagation();
        $scope.setFavoriteRepos(_.without($scope.getFavoriteRepos(), repoFullName));
    }

    $scope.removeFavoriteUser = function(login, $event) {
        $event.stopPropagation();
        $scope.setFavoriteUsers(_.without($scope.getFavoriteUsers(), login));
    }
}]);
