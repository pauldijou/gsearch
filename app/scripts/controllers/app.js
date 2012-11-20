'use strict';

gsearchApp.controller('AppCtrl', [ '$scope', '$location', 'searchRepos', 'searchUsers', 'util',
        function($scope, $location, searchRepos, searchUsers, util) {
            $scope.search = "";
            $scope.isUserSearch = false;
            $scope.result = [];
            $scope.eventFromFav = false;

            $scope.$on('button-fav', function(event, args) {
                $scope.eventFromFav = true;
                if (args.login) {
                    util.toggleFavoriteUser(args.login);
                } else {
                    util.toggleFavoriteRepo(util.getRepoFullName(args.owner, args.name));
                }
            });
            
            $scope.$on('showDetailRepo', function(event, owner, name) {
                if(!$scope.eventFromFav) {
                    $scope.showRepo(util.getRepoFullName(owner, name));
                }
                $scope.eventFromFav = false;
            });
            
            $scope.$on('showDetailUser', function(event, login) {
                if(!$scope.eventFromFav) {
                    $scope.showUser(login);
                }
                $scope.eventFromFav = false;
            });

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

                if (num > 1) {
                    return char;
                } else {
                    return '';
                }
            }

            $scope.showRepo = function(repoFullName) {
                $location.path('repo/' + repoFullName);
            }

            $scope.showUser = function(login) {
                $location.path('user/' + login);
            }
            
            $scope.isFavoriteRepo = function(owner, name) {
                return util.isFavoriteRepo(util.getRepoFullName(owner, name));
            }
            
            $scope.isFavoriteUser = function(login) {
                return util.isFavoriteUser(login);
            }

            $scope.getRepoFavTooltip = function(owner, name) {
                if ($scope.isFavoriteRepo(owner, name)) {
                    return "Remove from favorite";
                } else {
                    return "Add to favorite";
                }
            }

            $scope.getUserFavTooltip = function(login) {
                if ($scope.isFavoriteUser(login)) {
                    return "Remove from favorite";
                } else {
                    return "Add to favorite";
                }
            }
            
            $scope.hasFavoriteRepos = function() {
                return util.hasFavoriteRepos();
            }
            
            $scope.hasFavoriteUsers = function() {
                return util.hasFavoriteUsers();
            }
            
            $scope.getFavoriteRepos = function() {
                return util.getFavoriteRepos();
            }
            
            $scope.getFavoriteUsers = function() {
                return util.getFavoriteUsers();
            }
            
            $scope.clearFavoriteRepos = function() {
                util.clearFavoriteRepos();
            }
            
            $scope.clearFavoriteUsers = function() {
                util.clearFavoriteUsers();
            }
        } ]);
